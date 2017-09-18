handlers.ServerTime = function (args) {
  return {
    DateTime: ServerTime.Now()
  }
};

handlers.Building = function (args) {
  var m = new BuildManager();
  return m.Run(args);
};

handlers.Hero = function (args) {
  var m = new HeroManager();
  return m.Run(args);
};

handlers.Tech = function (args) {
  var m = new TechManager();
  return m.Run(args);
};

handlers.Raid = function (args) {
  var m = new RaidManager();
  return m.Run(args);
};

handlers.Campaign = function (args) {
  var m = CampaignManager();
  return m.Run(args);
};

// account creation handler
handlers.InitData = function (args) {
  var p = new Profile();
  return p.Init();
};