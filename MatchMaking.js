function MatchMaking() {
    this.FindEnemies = function () {

        var resultList = server.GetLeaderboardAroundUser({
            "StatisticName": "BattlePoint",
            "PlayFabId": currentPlayerId,
            "MaxResultsCount": 10,
        });

        return JSON.stringify(resultList);
    }
}