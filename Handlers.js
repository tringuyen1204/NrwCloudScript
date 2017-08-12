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
    "CompletedDate":1502548432708,
    "Upgrading":false,
    "MasterData":{
      "GoldCost":100,
      "ExpGain":10,
      "GoldStorage":1000,
      "FoodStorage":1000},
    "NextLevelData":{
      "GoldCost":1000,
      "ExpGain":40,
      "GoldStorage":1000,
      "FoodStorage":1000}
    };

  server.UpdateUserReadOnlyData({
    "PlayFabId": currentPlayerId,
    "Data":{
      "Castle0":JSON.stringify(castle),
      "Food":"\"{\"Value\":0,\"Max\":1000}",
      "Gold":"\"{\"Value\":0,\"Max\":1000}"
    }
  });

}
