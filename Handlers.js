handlers.ServerTime = function (args) {
    return String(Date.now());
};

// normal building handlers
handlers.Upgrade = function(args){
    var b = CreateBuilding(args.type);
    b.Upgrade(args.id, Number(args.date) );
};

handlers.Build = function (args) {
    var b = CreateBuilding(args.type);
    b.Build(args.id, Number(args.date), args.position );
};

handlers.CompleteBuilding = function (args) {
    var b = CreateBuilding(args.type);
    if (b.Completed(args.id)) {
        b.CompleteUpgrade(args.id, Number(args.date));
    }
    else {
        log.error("This building is not completed");
    }
};

handlers.BoostBuilding = function (args) {
    var b = CreateBuilding(args.type);
    b.BoostBuilding(args.id,  Number(args.date) );
};

// farm + market handlers
handlers.Collect = function (args) {
    var resB = new CreateBuilding(args.type);
    if (args.id == null) {
        resB.CollectAll( Number(args.date) );
    } else {
        resB.Collect(args.id, Number(args.date) );
    }
};

// troop handlers
handlers.ChangeTroop = function (args) {
    var b = CreateBuilding(BARRACK);
    b.ChangeTroop(args.id, Number(args.date), args.troopType);
};

handlers.KillTroop = function (args) {
    var b = CreateBuilding(BARRACK);
    b.KillTroop(args.id, Number(args.date), Number(args.amount));
};

handlers.BoostTrainAll = function (args) {
    var b = CreateBuilding(BARRACK);
    b.BoostTrainAll(Number(args.date));
};

handlers.BoostTrain = function (args) {
    var b = CreateBuilding(BARRACK);
    b.BoostTrain(args.id, Number(args.date));
};

// account creation handler
handlers.InitData = function(args){
    var castle = {
        "0":{
            "Level":1,
            "CompletedDate":0,
            "Upgrading":false
        }
    };

    var resource = {
        "Gold":{
            "Value":1000,
            "Max":2000
        },
        "Food":{
            "Value":1000,
            "Max":2000
        }
    };

    server.UpdateUserReadOnlyData({
        "PlayFabId": currentPlayerId,
        "Data":{
            "Castle":JSON.stringify(castle),
            "Resource":JSON.stringify(resource)
        }
    });
};