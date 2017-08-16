handlers.ServerTime = function (args) {
    return String(Date.now());
}

handlers.Build = function(args){
    var b = BuildingHandlerFromType(args.type);
    b.StartUpgrade(args.id);
};

handlers.CompleteBuilding = function (args) {
    var b = BuildingHandlerFromType(args.type);
    b.CompleteUpgrade(args.id);
};

handlers.FastForwardBuilding = function (args) {
    var b = BuildingHandlerFromType(args.type);
    b.FastForward(args.id);
};

handlers.Collect = function (args) {
    var resB = ResourceBuildingHandler(args.type);
    if (args.id == null) {
        resB.CollectAll();
    } else {
        resB.Collect(args.id);
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