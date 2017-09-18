RaidManager = function (playerId) {
    DataManager.call(this, "Raid", playerId);
};

RaidManager.prototype = Object.create(DataManager.prototype);

RaidManager.prototype.Run = function (args) {
    args = this.FormatData(args);

    switch (args.command) {
        case CMD_FIND_ENEMIES:
            return this.FindEnemies(args);
        case CMD_SCOUT:
            return this.Scout(args);
    }
    var handler = this.GetHandler(args);

    if (handler !== null && handler.Run(args)) {
        this.Push(args);
    }
    return this.Data;
};

RaidManager.prototype.Scout = function (args) {

    var rData = this.Data;
    var b = new BuildManager(args.target);
    var ret = b.ProducedResource(args);
    var resMan = new ResHandler(args.target);

    var gold = Math.floor(resMan.ValueOf(GOLD) * 0.25);
    var food = Math.floor(resMan.ValueOf(FOOD) * 0.25);
    rData[GOLD] = gold;
    rData[FOOD] = food;
    rData["ProducedGold"] = ret.ProducedGold;
    rData["ProducedFood"] = ret.ProducedFood;

    this.Push();

    return rData;
};

RaidManager.prototype.GetHandler = function (args) {
    return new RaidHandler();
};

RaidManager.prototype.FindEnemies = function (args) {
    var minDelta = -200;
    var maxDelta = 100;

    var maxCount = 20;
    maxCount = args === null ? maxCount : args.MaxResultsCount;

    var result = [];

    var index;

    for (index = 0; index < 3; index++) {

        var statName = "BattlePoint" + (index + 1);

        result[index] = server.GetLeaderboardAroundUser({
            StatisticName: statName,
            PlayFabId: this.PlayFabId,
            MaxResultsCount: maxCount
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

    GloryPoint.Set(curGP);

    return JSON.stringify(ret);
};