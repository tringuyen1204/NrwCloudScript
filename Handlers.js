handlers.Build = function(args){
  var building = new Building(args.type, args.index);
  building.StartUpgrade();
}
handlers.ChangeResources = function(args){
  var res = new Resource(GOLD);
  res.SetMax(1000);
  res.Change(100);
}

handlers.InitData = function(args){
  var castle = {
    "Level":1,
    "CompletedDate":0,
    "Upgrading":false
    };

  server.UpdateUserReadOnlyData({
    "PlayFabId": currentPlayerId,
    "Data":{
      "Castle0":JSON.stringify(castle),
      "Food":"{\"Value\":1000,\"Max\":2000}",
      "Gold":"{\"Value\":1000,\"Max\":2000}"
    }
  });
}
