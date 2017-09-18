handlers.ServerTime = function (args) {
    return {
        DateTime: ServerTime.Now()
    }
};

handlers.Building = function (args) {
    var m = new BuildingManager();
    return m.Execute(args);
};

handlers.Hero = function (args) {
    var m = new HeroManager();
    return m.Execute(args);
};

handlers.Tech = function (args) {
    var m = new TechManager();
    return m.Execute(args);
};

handlers.Raid = function (args) {
    var m = new RaidManager();
    return m.Execute(args);
};

handlers.Campaign = function (args) {
    var m = CampaignManager();
    return m.Execute(args);
};

// account creation handler
handlers.InitData = function (args) {
    var p = new Profile();
    return p.Init();
};