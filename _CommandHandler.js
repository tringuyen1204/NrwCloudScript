handlers.ServerTime = function (args) {
    return {
        Date: ServerTime.Now()
    }
};

handlers.Run = function (args) {
    args = FormatData(args);
    var id = args.id;
    var handler = HandlerPool.HandlerFromId(id);
    if (handler !== null) {
        return handler.Run(args);
    }
};

handlers.Raid = function (args) {
    var m = new RaidHandler(currentPlayerId, args.target);
    return m.Run(args);
};

handlers.Spy = function (args) {
    var m = new SpyHandler();
    return m.Run(args);
};

handlers.Campaign = function (args) {
    var m = new CampaignManager();
    return m.Run(args);
};

// account creation handler
handlers.InitData = function (args) {
    var p = new Profile();
    return p.Init();
};

handlers.OpenChest = function (args) {
    var m = new GachaHandler();
    return m.OpenChest(args);
};

handlers.GetTroopInfo = function (args) {
    var m = new BuildManager();
    return m.GetTroopInfo(args);
};

function FormatData(args) {
    if (args === null || args === undefined) {
        args = {};
    }
    if (!args.hasOwnProperty("date")) {
        args.date = ServerTime.Now();
    }
    return args;
}