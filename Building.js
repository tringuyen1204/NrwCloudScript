function GetBuidingData(buildingID){
  var GetCatalogItemsRequest = {
    "CatalogVersion ": buildingID
  };

  var GetCatalogItemsResults = server.GetCatalogItems(GetCatalogItemsRequest);
  return GetCatalogItemsResults;
}


handlers.Test = function(args){
  var result = GetBuidingData(args.buildingID);
  log.debug("data: ", result.data);
  return 1;
}
