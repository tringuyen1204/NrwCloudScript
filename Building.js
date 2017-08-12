function GetBuidingData(buildingType){
  var GetCatalogItemsRequest = {
    "CatalogVersion ": buildingType
  };

  var GetCatalogItemsResults = server.GetCatalogItems(GetCatalogItemsRequest);
  return GetCatalogItemsResults;
}

function ConstructBuilding(buildingType, index){


  var GetUserReadOnlyDataRequest = {
    "PlayFabId":currentPlayerId,
    "Keys": [buildingType]
  }

  var GetUserDataResult = server.GetUserReadOnlyData(GetUserReadOnlyDataRequest);

  var curLv = 0;
  if (GetUserDataResult.Data[buildingId] != null){
    var allBuildings = JSON.parse(GetUserDataResult.Data[buildingType]);

    if (allBuildings.length > index){
      curLv = allBuildings[index].lvl;
    }
  }
  curLv += 1;

  var newBuildingData = {
    "lvl":curLv,
    "updateTime":10
  }

  allBuildings[index] = newBuildingData;

  var newData = {};
  newData[buildingType] = JSON.stringify(allBuildings);

  var UpdateUserReadOnlyDataRequest = {
    "PlayFabId":currentPlayerId,
    "Data":allBuildings
  };

  server.UpdateUserReadOnlyData(UpdateUserReadOnlyDataRequest);
}

handlers.Test = function(args){
  //var result = GetBuidingData(args.buildingType);
  //log.debug("data: ", result.data);

  ConstructBuilding("castle", 0);
  ConstructBuilding("market", 0);
  ConstructBuilding("market", 1);
  return 1;
}
