/**
 * @returns {string}
 */
handlers.ServerTime = function (args) {
    return String(Date.now());
};

handlers.ProcessBuilding = function (args) {
    var b = new BuildingManager();
    b.Execute(args);
};

handlers.Scout = function (args) {
    var b = new BuildingManager(args.playerId);
    return b.GetRaidInfo(args);
};

handlers.FindEnemiesEnemies = function (args) {
    var m = new MatchMaking();
    return m.FindEnemies(args);
};

// account creation handler
handlers.InitData = function(args){
    var p = new Profile();
    p.Init();
};