function GetBuidingData(buildingID){
  var GetStoreItemsRequest = {
    "StoreId": buildingID;
  }

  var GetStoreItemResult = server.GetStoreItems(GetStoreItemsRequest);
  return GetStoreItemResult;
}


handlers.Test = function(args){
  var result = GetBuidingData(args.buildingID);
  log.debug("data: ", result.data);
  return 1;
}
