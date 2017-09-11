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
    var m = new MatchMaking();
    return m.FindEnemies(args);
};

// account creation handler
handlers.InitData = function(args){
    var p = new Profile();
    p.Init();
};