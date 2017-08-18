handlers.ServerTime = function (args) {
    return String(Date.now());
}

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

handlers.Collect = function (args) {
    var resB = ResBuildHandler(args.type);
    if (args.id == null) {
        resB.CollectAll( Number(args.date) );
    } else {
        resB.Collect(args.id, Number(args.date) );
    }
};

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