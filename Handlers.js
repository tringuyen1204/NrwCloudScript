/**
 * @returns {string}
 */
handlers.ServerTime = function (args) {
    return String(Date.now());
};

handlers.UpdateBuilding = function (args) {
    var b = new BuildingManager();
    b.Execute(args);
};

handlers.Scout = function (args) {
    var b = new BuildingManager(args.playerId);
    var ret = b.AllProduceResource(args);
    var resMan = new ResHandler(args.playerId);

    var gold = Math.floor(resMan.ValueOf(GOLD) * 0.25);
    var food = Math.floor(resMan.ValueOf(FOOD) * 0.25);
    ret[GOLD] = gold;
    ret[FOOD] = food;
    return ret;
};

handlers.FindEnemies = function (args) {
    return MatchMaking.FindEnemies(args);
};

// account creation handler
handlers.InitData = function(args){
    var p = new Profile();
    p.Init();
};

handlers.Raid = function (args) {

    if (!args.hasOwnProperty("result")) {
        args.result = Math.random() > 0.4;
    }

    if (args.result) {
        log.info("Attacker win!");

        var b = new BuildingManager(args.playerId);
        b.ApplyRaid(args);

        var r = new ResHandler(args.playerId);
        r.ApplyRaid(args);
    }
    else {
        log.info("Attacker lose");
    }

    MatchMaking.ApplyRaidResult(args);
};