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
    "Upgrading":false,
    "MasterData":{
    "FortLimit": 1,
    "BarrackLimit": 1,
    "ExpGain": 2,
    "MarketLimit": 0,
    "MercenaryCampLimit": 0,
    "FoodCapacity": 2000,
    "FoodStorageLimit": 1,
    "FarmLimit": 0,
    "BuildTime": 6,
    "TempleLimit": 0,
    "BarracksLimit": 1,
    "GarrisonLimit": 0,
    "ArmoryLimit": 0,
    "GoldCapacity": 2000,
    "MortarLimit": 0,
    "GoldStorageLimit": 1,
    "LvlUserReq": 1,
    "AcademyLimit": 0,
    "TowerLimit": 1,
    "GoldCost": 100,
    "StrongHoldLimit": 0
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
