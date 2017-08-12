handlers.Build = function(args){
  var building = new Building(args.type, args.index);
  building.StartUpgrade();
}
handlers.ChangeResources = function(args){
  var res = new Resource(GOLD);
  res.SetMax(1000);
  res.Change(100);
}
