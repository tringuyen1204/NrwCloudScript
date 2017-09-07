
function MatchMaking() {
    this.FindEnemies = function () {

        var resultList = server.GetLeaderboardAroundUser({
            "StatisticName": "BattlePoint",
            "PlayFabId": currentPlayerId,
            "MaxResultsCount": 10
        });

        return JSON.stringify(resultList);
    };

    this.UpdateBattlePoint = function (gloryPoint) {
        var ranges = [-15, -5, 5];

        for (var a = 0; a < ranges.length; a++) {
            ranges[a] = Math.floor(ranges[a] + Math.random() * 10);
        }

        var battlePoints = [];

        var constant = server.GetTitleData({
            "Keys": [
                "MinBattlePointCoeff",
                "MaxBattlePointCoeff"
            ]
        }).Data;

        while (ranges.length > 0) {

            var index = Math.floor(Math.random() * ranges.length);


            var newValue;

            if (ranges[index] > 0) {
                newValue = (gloryPoint + ranges[index] * constant.MaxBattlePointCoeff) * 10000 + gloryPoint;
            }
            else {
                newValue = (gloryPoint + ranges[index] * constant.MinBattlePointCoeff) * 10000 + gloryPoint;
            }

            battlePoints.push(newValue);
            ranges.remove(index);
        }

        server.UpdatePlayerStatistics({
            "PlayFabId": currentPlayerId,
            "Statistics": [
                {
                    "StatisticName": "BattlePoint1",
                    "Value": battlePoints[0]
                },
                {
                    "StatisticName": "BattlePoint2",
                    "Value": battlePoints[1]
                },
                {
                    "StatisticName": "BattlePoint3",
                    "Value": battlePoints[2]
                },
                {
                    "StatisticName": "GloryPoint",
                    "Value": gloryPoint
                }
            ]
        });
    }
}