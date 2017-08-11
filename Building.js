function GetBuidingData(buildingType){
  var GetCatalogItemsRequest = {
    "CatalogVersion ": buildingType
  };

  var GetCatalogItemsResults = server.GetCatalogItems(GetCatalogItemsRequest);
  return GetCatalogItemsResults;
}

function ConstructBuilding(buildingType, index){

  var buildingId = buildingType + index;

  var GetUserDataRequest = {
    "PlayFabId":currentPlayerId,
    "Keys": [buildingId]
  }

  var GetUserDataResult = server.GetUserData(GetUserDataRequest);

  var curLv = 0
  if (GetUserDataResult.Data[buildingId] != null){
    curLv = GetUserDataResult.Data[buildingId]["lvl"];
  }
  curLv += 1;

  var UpdateUserDataRequest = {
    "PlayFabId":currentPlayerId,
    "Data":{
      buildingId:{
        "lvl":curLv,
        "updateTime":server.GetServerTime()
      }
    }
  };

  server.UpdateUserData(UpdateUserDataRequest);
}

handlers.Test = function(args){
  //var result = GetBuidingData(args.buildingType);
  //log.debug("data: ", result.data);

  ConstructBuilding("castle", 0);
  return 1;
}
