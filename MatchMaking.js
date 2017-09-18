var MatchMaking = {};

MatchMaking.FindEnemies = function (args) {
    var minDelta = -200;
    var maxDelta = 100;

    var maxCount = 20;
    maxCount = args === null ? maxCount : args.MaxResultsCount;

    var result = [];

    var index;

    for (index = 0; index < 3; index++) {

        var statName = "BattlePoint" + (index + 1);

        result[index] = server.GetLeaderboardAroundUser({
            "StatisticName": statName,
            "PlayFabId": PLAYER_ID,
            "MaxResultsCount": maxCount
        });
    }

    var a, b;

    var ret = {};
    ret.Info = {};
    ret.List = {};

    var data;

    var curGP;

    for (a = 0; a < result.length; a++) {
        for (b = 0; b < result[a].Leaderboard.length; b++) {
            data = result[a].Leaderboard[b];
            if (data.PlayFabId === PLAYER_ID) {
                if (!ret.hasOwnProperty("MyBattlePoint")) {
                    curGP = Math.floor(data.StatValue / 10) % 10000;

                    ret.Info = {
                        GP: curGP,
                        E: data.StatValue % 10
                    }
                }
                break;
            }
        }
    }

    var inRange = 0;
    var total = 0;
    var newData;

    for (a = 0; a < result.length; a++) {
        for (b = 0; b < result[a].Leaderboard.length; b++) {
            data = result[a].Leaderboard[b];

            if (data.PlayFabId === PLAYER_ID) {
                continue;
            }

            if (!ret.List.hasOwnProperty(data.PlayFabId)) {

                var GP = Math.floor(data.StatValue / 10) % 10000;
                var delta = GP - curGP;

                var deltaInRange = minDelta <= delta && delta <= maxDelta;

                if (deltaInRange) {
                    inRange++;
                }

                total++;

                newData = {
                    E: data.StatValue % 10,
                    Delta: delta
                };

                ret.List[data.PlayFabId] = newData;
            }
        }
    }

    ret.Info.Total = total;
    ret.Info.InRange = inRange;

    MatchMaking.SetGloryPoint(curGP);

    return JSON.stringify(ret);
};

MatchMaking.ApplyRaidResult = function (args) {

    var atkId = PLAYER_ID;
    var defId = args.target;
    var result = args.result;

    var atkBoard = server.GetLeaderboardAroundUser({
        "StatisticName": "GloryPoint",
        "PlayFabId": atkId,
        "MaxResultsCount": 1
    });

    var defBoard = server.GetLeaderboardAroundUser({
        "StatisticName": "GloryPoint",
        "PlayFabId": defId,
        "MaxResultsCount": 1
    });

    var atkGp = atkBoard.Leaderboard[0].StatValue;
    var defGp = defBoard.Leaderboard[0].StatValue;

    var deltaGp = atkGp - defGp;

    var a, b;
    var limit;

    if (result) {
        a = -0.0794;
        b = 29.35838;
        limit = 59;
    }
    else {
        a = 0.0531;
        b = 19.60453;
        limit = 39;
    }

    // atk
    var atkGpMod = a * deltaGp + b;

    if (atkGpMod < 0) {
        atkGpMod = 0;
    }
    else if (atkGpMod > limit) {
        atkGpMod = limit;
    }

    // def
    var defGpMod = a * -deltaGp + b;

    if (defGpMod < 0) {
        defGpMod = 0;
    }
    else if (defGpMod > limit) {
        defGpMod = limit;
    }

    if (result) {
        defGpMod = -defGpMod;
    }
    else {
        atkGpMod = -atkGpMod;
    }

    MatchMaking.SetGloryPoint(atkGp + Math.floor(atkGpMod), atkId);
    MatchMaking.SetGloryPoint(defGp + Math.floor(defGpMod), defId);
};

MatchMaking.SetGloryPoint = function (gp, pId) {

    pId = ( pId === null || pId === undefined ) ? PLAYER_ID : pId;

    var points = [-15, -5, 5];

    var elo = Math.randomBetween(0, 9);

    var a;
    for (a = 0; a < points.length; a++) {
        points[a] = Math.floor(points[a] + Math.random() * 10);

        if (points[a] > 0) {
            points[a] = (gp + points[a] * 2) * 10000 + gp;
        }
        else {
            points[a] = (gp + points[a] * -16) * 10000 + gp;
        }
        points[a] = Math.floor(points[a] * 10 + elo);
    }

    var j, x, i;
    for (i = points.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = points[i - 1];
        points[i - 1] = points[j];
        points[j] = x;
    }

    server.UpdatePlayerStatistics({
        "PlayFabId": pId,
        "Statistics": [
            {
                StatisticName: "BattlePoint1",
                Value: points[0]
            },
            {
                StatisticName: "BattlePoint2",
                Value: points[1]
            },
            {
                StatisticName: "BattlePoint3",
                Value: points[2]
            },
            {
                StatisticName: "GloryPoint",
                Value: gp
            }
        ]
    });
};