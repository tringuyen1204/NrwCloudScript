function SpyHandler(pId) {
    DefaultHandler.call(this, pId, [LOGS]);

    this.Run = function (args) {
        args = this.FormatArgs(args);
        switch (args.command) {
            case CMD.BATTLE.FIND_ENEMIES:
                return this.FindEnemies(args);
            case CMD.BATTLE.SCOUT:
                return this.Scout(args);
        }
    };

    this.FindEnemies = function (args) {
        var minDelta = -200;
        var maxDelta = 100;

        var maxCount = 20;
        maxCount = ( args === null || !args.hasOwnProperty("MaxResults") ) ? maxCount : args.MaxResults;

        var result = [];

        var index;

        for (index = 0; index < 3; index++) {

            var statName = "BattlePoint" + (index + 1);

            result[index] = server.GetLeaderboardAroundUser({
                "StatisticName": statName,
                "PlayFabId": this.PlayerId,
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
                if (data.PlayFabId === currentPlayerId) {
                    curGP = Math.floor(data.StatValue / 10) % 10000;

                    ret.Info = {
                        GP: curGP,
                        E: data.StatValue % 10
                    };
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

        GloryPoint.Set(curGP);

        return ret;
    };

    this.Scout = function (args) {
        var atkId = currentPlayerId;
        var defId = args.target;

        ServerData.Get(defId).Load([BUILDING, RESOURCE]);

        var b = new ResHandler(defId);
        var ret = b.AllResource(args);
        var resMan = new ResHandler(defId);

        var gold = Math.floor(resMan.ValueOf(RES.GOLD) * 0.25);
        var food = Math.floor(resMan.ValueOf(RES.FOOD) * 0.25);

        var scoutData = {};

        scoutData[RES.GOLD] = gold;
        scoutData[RES.FOOD] = food;
        scoutData["ProducedGold"] = Math.floor(ret[RES.GOLD] * 0.5);
        scoutData["ProducedFood"] = Math.floor(ret[RES.FOOD] * 0.5);

        scoutData.AtkId = atkId;
        scoutData.DefId = defId;

        scoutData.AtkGp = server.GetPlayerStatistics({
            PlayFabId: atkId,
            StatisticNames: [GP]
        }).Statistics[0].Value;

        scoutData.DefGp = server.GetPlayerStatistics({
            PlayFabId: defId,
            StatisticNames: [GP]
        }).Statistics[0].Value;

        this.Data[LOGS].ScoutData = scoutData;
        this.Push();

        return scoutData;
    };
}

SpyHandler.prototype = Object.create(DefaultHandler.prototype);
