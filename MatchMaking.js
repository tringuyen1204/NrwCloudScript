function MatchMaking() {
    this.FindEnemies = function (args) {

        var maxCount = args === null ? 10 : args.MaxResultsCount;

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

        for (a = 0; a < result.length; a++) {
            for (b = 0; b < result[a].Leaderboard.length; b++) {
                data = result[a].Leaderboard[b];

                if (data.PlayFabId === currentPlayerId) {
                    if (retData.MyBattlePoint === null) {
                        retData.MyBattlePoint = data.StatValue;
                    }
                    continue;
                }

                if (!eList.hasOwnProperty(data.PlayFabId)) {
                    eList[data.PlayFabId] = data.StatValue;
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