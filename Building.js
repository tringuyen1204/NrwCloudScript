function GetBuidingData(buildingID){
  var GetCatalogItemsRequest = {
    "CatalogVersion ": "BuildingData"
  };

  var GetCatalogItemsResults = server.GetCatalogItems(GetCatalogItemsRequest);
  return GetCatalogItemsResults;
}


handlers.Test = function(args){
  var result = GetBuidingData(args.buildingID);
  log.debug("data: ", result.data);
  return 1;
}
