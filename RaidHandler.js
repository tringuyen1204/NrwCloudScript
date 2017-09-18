RaidHandler = function () {
};

RaidHandler.prototype.Execute = function (args) {
    switch (args.command) {
        case CMD_START_BATTLE:
            return this.StartBattle(args);
        case CMD_UPDATE_BATTLE:
            return this.UpdateBattle(args);
        case CMD_END_BATTLE:
            return this.EndBattle(args);
    }
    return false;
};

RaidHandler.prototype.StartBattle = function (args) {

};

RaidHandler.prototype.UpdateBattle = function (args) {

};

RaidHandler.prototype.EndBattle = function (args) {

    if (!args.hasOwnProperty("result")) {
        args.result = Math.random() > 0.4;
        args.rate = 0.5;
    }

    if (args.result) {
        log.info("Attacker win!");

        var b = new BuildingManager(args.target);
        b.ApplyRaid(args);

        var r = new ResHandler(args.target);
        r.ApplyRaid(args);

        var resMan = new ResHandler();
        var raidData;

        var rawData = server.GetUserReadOnlyData({
            "PlayFabId": PLAYER_ID,
            "Keys": ["Raid"]
        }).Data;

        if (rawData.hasOwnProperty("Raid")) {
            raidData = JSON.parse(rawData["Raid"].Value);
        }

        resMan.Change(GOLD, raidData[GOLD] + raidData["ProducedGold"]);
        resMan.Change(FOOD, raidData[FOOD] + raidData["ProducedFood"]);
        resMan.Push();
    }
    else {
        log.info("Attacker lose");
    }

    this.ApplyResult(result);
};

RaidHandler.prototype.ApplyResult = function (args) {
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

    KingdomManager.SetGloryPoint(atkGp + Math.floor(atkGpMod), atkId);
    KingdomManager.SetGloryPoint(defGp + Math.floor(defGpMod), defId);
};