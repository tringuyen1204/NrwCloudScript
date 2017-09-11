/**
 * @returns {string}
 */
handlers.ServerTime = function (args) {
    return String(Date.now());
};

// normal building handlers
handlers.Upgrade = function(args){
    var b = new Building();
    b.Upgrade(args);
};

handlers.Build = function (args) {
    var b = CreateHandler(args.type);
    b.Build(args.id, Number(args.date), args.position );
};

handlers.CompleteBuilding = function (args) {
    var b = new Building();
    b.CompleteUpgrade(args);
};

handlers.BoostBuilding = function (args) {
    var b = new Building();
    b.BoostBuilding(args);
};

// farm + market handlers
handlers.Collect = function (args) {
    var b = new Building();
    b.Collect(args);
};

// troop handlers
handlers.ChangeTroop = function (args) {
    var b = CreateHandler(BARRACK);
    b.ChangeTroop(args.id, Number(args.date), args.troopType);
};

handlers.KillTroop = function (args) {
    var b = CreateHandler(BARRACK);
    b.KillTroop(args.id, Number(args.date), Number(args.amount));
};

handlers.BoostTrainAll = function (args) {
    var b = CreateHandler(BARRACK);
    b.BoostTrainAll(Number(args.date));
};

handlers.BoostTrain = function (args) {
    var b = CreateHandler(BARRACK);
    b.BoostTrain(args.id, Number(args.date));
};

handlers.Scout = function (args) {

};

handlers.FindEnemiesEnemies = function (args) {
    var m = new MatchMaking();
    return m.FindEnemies(args);
};

// account creation handler
handlers.InitData = function(args){

    var p = new Profile();
    p.Init();

    // var castle;
    // castle = {
    //     "0": {
    //         "Level": 1,
    //         "CompletedDate": 0,
    //         "Upgrading": false,
    //         "Position": "s01"
    //     }
    // };
    //
    // var resource;
    // resource = {
    //     "Gold": {
    //         "Value": 1000,
    //         "Max": 2000
    //     },
    //     "Food": {
    //         "Value": 1000,
    //         "Max": 2000
    //     }
    // };
    //
    // server.UpdateUserReadOnlyData({
    //     "PlayFabId": currentPlayerId,
    //     "Data": {
    //         "Castle": JSON.stringify(castle),
    //         "Resource": JSON.stringify(resource)
    //     }
    // });
    //
    // var gloryPoint = Math.floor(Math.random() * 2700 + 300);
    //
    // var m = new MatchMaking();
    // m.UpdateBattlePoint(gloryPoint);
};