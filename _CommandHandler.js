handlers.ServerTime = function (args) {
    return {
        Date: ServerTime.Now()
    }
};

handlers.Run = function (args) {

    var id = args.id;

    var objClass = id.split('.')[0];

    var manager;

    switch (objClass) {
        case BUILDING:
            manager = new BuildManager();
            break;
        case GENERAL:
        case ADVISOR:
            manager = new HeroManager();
            break;
        case TECH:
            manager = new TechManager();
            break;
    }
    if (manager !== undefined) {
        return manager.Run(args);
    }
};

handlers.Raid = function (args) {
    var m = new RaidManager(currentPlayerId, args.target);
    return m.Run(args);
};

handlers.Spy = function (args) {
    var m = new SpyManager();
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
    var m = new GachaManager();
    return m.OpenChest(args);
};

handlers.GetTroopInfo = function (args) {
    var m = new BuildManager();
    return m.GetTroopInfo(args);
};
