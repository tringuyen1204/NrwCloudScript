function GetReadOnlyData(keys) {
  var GetUserReadOnlyDataRequest = {
    "PlayFabId":currentPlayerId,
    "Keys": keys
  }

  var GetUserDataResult = server.GetUserReadOnlyData(GetUserReadOnlyDataRequest);
  return GetUserDataResult.Data;
}

function GetCatalog(name){
  var GetCatalogItemsRequest = {
    "CatalogVersion ": name
  };

  var GetCatalogItemsResults = server.GetCatalogItems(GetCatalogItemsRequest);
  return GetCatalogItemsResults;
}

function GrantItem(ItemIds)
{
 	var GrantItemsToUserRequest = {
      "PlayFabId" : currentPlayerId,
      "ItemIds" : ItemIds
    };

    var result = server.GrantItemsToUser(GrantItemsToUserRequest);
  	return JSON.stringify(result);
}

function UpdateReadOnlyData(data){
  var UpdateUserReadOnlyDataRequest = {
    "PlayFabId":currentPlayerId,
    "Data":data
  };

  server.UpdateUserReadOnlyData(UpdateUserReadOnlyDataRequest);
}
