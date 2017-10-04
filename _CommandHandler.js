handlers.ServerTime = function (args) {
    return {
        Date: ServerTime.Now()
    }
};

handlers.Run = function (args) {
    var id = args.id;
    var handler = Handler.FromId(id);
    args = FormatArgs(args);
    if (handler !== null) {
        return handler.Run(args);
    }
    else {
        return {"error": "error"};
    }
};

handlers.Raid = function (args) {
    args = FormatArgs(args);
    var m = new RaidHandler(currentPlayerId, args.target);
    return m.Run(args);
};

handlers.Spy = function (args) {
    args = FormatArgs(args);
    var m = new SpyHandler();
    return m.Run(args);
};

// account creation handler
handlers.InitData = function (args) {
    args = FormatArgs(args);
    var p = new AccountHandler();
    return p.Init();
};

handlers.OpenChest = function (args) {
    args = FormatArgs(args);
    var m = new GachaHandler();
    return m.OpenChest(args);
};

handlers.GetTroopInfo = function (args) {
    args = FormatArgs(args);
    var m = new BarrackHandler();
    return m.GetTroopInfo(args);
};

function FormatArgs(args) {
    if (args === null || args === undefined) {
        args = {};
    }
    if (!args.hasOwnProperty("date")) {
        args.date = ServerTime.Now();
    }
    else {
        args.date = Math.floor(args.date);
    }
    return args;
}