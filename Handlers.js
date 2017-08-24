handlers.ServerTime = function (args) {
    return String(Date.now());
}

// normal building handlers
handlers.Build = function(args){
    var b = BuildingHandlerFromType(args.type);
    b.StartUpgrade(args.id, Number(args.date) );
};

handlers.CompleteBuilding = function (args) {
    var b = BuildingHandlerFromType(args.type);
    if (b.Completed(args.id)) {
        b.CompleteUpgrade(args.id, Number(args.date));
    }
    else {
        log.error("This building is not completed");
    }
};

handlers.FastForwardBuilding = function (args) {
    var b = BuildingHandlerFromType(args.type);
    b.FastForward(args.id,  Number(args.date) );
};

// farm + market handlers
handlers.Collect = function (args) {
    var resB = new BuildingHandlerFromType(args.type);
    if (args.id == null) {
        resB.CollectAll( Number(args.date) );
    } else {
        resB.Collect(args.id, Number(args.date) );
    }
};

// troop handlers
handlers.ChangeTroop = function (args) {
    var b = BuildingHandlerFromType(BARRACK);
    b.ChangeTroop(args.id, Number(args.date), Number(args.troopType));
}

handlers.KillTroop = function (args) {
    var b = BuildingHandlerFromType(BARRACK);
    b.KillTroop(args.id, Number(args.date), Number(args.amount));
}

handlers.BoostTrainAll = function (args) {
    var b = BuildingHandlerFromType(BARRACK);
    b.BoostTrainAll(Number(args.date));
};

handlers.BoostTrain = function (args) {
    var b = BuildingHandlerFromType(BARRACK);
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