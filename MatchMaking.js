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
            "PlayFabId": currentPlayerId,
            "MaxResultsCount": maxCount
        });
    }

    var eList = {};
    var a, b;

    var retData = {};
    retData.Info = {};
    retData.List = eList;

    var data;

    var curGP;

    for (a = 0; a < result.length; a++) {
        for (b = 0; b < result[a].Leaderboard.length; b++) {
            data = result[a].Leaderboard[b];
            if (data.PlayFabId === currentPlayerId) {
                if (!retData.hasOwnProperty("MyBattlePoint")) {
                    curGP = Math.floor(data.StatValue / 10) % 10000;

                    retData.Info = {
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

            if (data.PlayFabId === currentPlayerId) {
                continue;
            }

            if (!eList.hasOwnProperty(data.PlayFabId)) {

                var GP = Math.floor(data.StatValue / 10) % 10000;
                var delta = GP - curGP;

                var isInRange = minDelta <= delta && delta <= maxDelta;

                if (isInRange) {
                    inRange++;
                }

                total++;

                newData = {
                    E: data.StatValue % 10,
                    Delta: delta
                };

                eList[data.PlayFabId] = newData;
            }
        }
    }

    retData.Info.Total = total;
    retData.Info.InRange = inRange;

    MatchMaking.UpdateGloryPoint(curGP);

    return JSON.stringify(retData);
};

MatchMaking.ApplyRaidResult = function (args) {

    var atkId = curPlayerId;
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

    var atkGp = atkBoard[0].statValue;
    var defGp = defBoard[0].statValue;

    var deltaGp = atkGp - defGp;

    var a, b;
    var limit;

    if (result) {
        a = -0.0794;
        b = 29.35838;
        limit = 39;
    }
    else {
        a = 0.0531;
        b = 19.60453;
        limit = 59;
    }

    // atk
    var atkGpChange = a * deltaGp + b;

    if (atkGpChange < 0) {
        atkGpChange = 0;
    }
    else if (atkGpChange > limit) {
        atkGpChange = limit;
    }

    // def
    var defGpChange = a * -deltaGp + b;

    if (defGpChange < 0) {
        defGpChange = 0;
    }
    else if (defGpChange > limit) {
        defGpChange = limit;
    }

    if (result) {
        defGpChange = -defGpChange;
    }
    else {
        atkGpChange = -atkGpChange;
    }

    log.info("attacker id = " + atkId + " gp change = " + atkGpChange);
    log.info("defender id = " + defId + " gp change = " + defGpChange);

    MatchMaking.UpdateGloryPoint(atkGp + atkGpChange, atkId);
    MatchMaking.UpdateGloryPoint(defGp + defGpChange, defId);
};

MatchMaking.UpdateGloryPoint = function (gloryPoint, playerId) {

    playerId = ( playerId === null || playerId === undefined ) ? currentPlayerId : playerId;

    var points = [-15, -5, 5];

    var elo = Math.randomBetween(0, 9);

    var a;
    for (a = 0; a < points.length; a++) {
        points[a] = Math.floor(points[a] + Math.random() * 10);

        if (points[a] > 0) {
            points[a] = (gloryPoint + points[a] * 2) * 10000 + gloryPoint;
        }
        else {
            points[a] = (gloryPoint + points[a] * -16) * 10000 + gloryPoint;
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
        "PlayFabId": playerId,
        "Statistics": [
            {
                "StatisticName": "BattlePoint1",
                "Value": points[0]
            },
            {
                "StatisticName": "BattlePoint2",
                "Value": points[1]
            },
            {
                "StatisticName": "BattlePoint3",
                "Value": points[2]
            },
            {
                "StatisticName": "GloryPoint",
                "Value": gloryPoint
            }
        ]
    });
};