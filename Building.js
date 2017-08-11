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
    var buildingObj = JSON.parse(GetUserDataResult.Data[buildingId]);
    curLv = buildingObj.lvl;
  }
  curLv += 1;

  var newBuildingData = {
    "lvl":curLv,
    "updateTime":10
  }

  var UpdateUserDataRequest = {
    "PlayFabId":currentPlayerId,
    "Data":{
      buildingId: JSON.stringify(newBuildingData)
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
