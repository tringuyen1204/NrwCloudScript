handlers.Build = function(args){

  var castle = new Building(CASTLE, 0);
  castle.StartUpgrade();

  return 1;
}
