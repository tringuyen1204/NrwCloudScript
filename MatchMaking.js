function MatchMaking() {
    this.FindEnemies = function (args) {

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
        retData.List = eList;

        var data;

        var curGP;

        for (a = 0; a < result.length; a++) {
            for (b = 0; b < result[a].Leaderboard.length; b++) {
                data = result[a].Leaderboard[b];

                if (data.PlayFabId === currentPlayerId) {
                    if (!retData.hasOwnProperty("MyBattlePoint")) {
                        curGP = Math.floor(retData.StatValue % 10000 / 10);
                        retData.MyBattlePoint = {
                            GP: curGP,
                            E: retData.StatValue % 100000000
                        }
                    }
                    continue;
                }

                if (!eList.hasOwnProperty(data.PlayFabId)) {

                    var GP = Math.floor(retData.StatValue % 10000 / 10);
                    var delta = GP - curGP;

                    var newData = {
                        GP: GP,
                        E: retData.StatValue % 100000000,
                        Delta: delta,
                        InRange: minDelta <= delta && delta <= maxDelta
                    };

                    eList[data.PlayFabId] = newData;
                }
            }
        }

        return JSON.stringify(retData);
    };

    this.UpdateBattlePoint = function (gloryPoint) {
        var points = [-15, -5, 5];

        var elo = Math.randomBetween(0, 9);

        var a;
        for (a = 0; a < points.length; a++) {
            points[a] = Math.floor(points[a] + Math.random() * 10);

            if (points[a] > 0) {
                points[a] = (gloryPoint + points[a] * 1) * 10000 + gloryPoint;
            }
            else {
                points[a] = (gloryPoint + points[a] * -8) * 10000 + gloryPoint;
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
            "PlayFabId": currentPlayerId,
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
    }
}