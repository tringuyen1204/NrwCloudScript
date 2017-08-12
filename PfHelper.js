function PfHelper(){
  this.GetReadOnlyData = function(keys) {
    var GetUserReadOnlyDataRequest = {
      "PlayFabId":currentPlayerId,
      "Keys": keys
    }

    var GetUserDataResult = server.GetUserReadOnlyData(GetUserReadOnlyDataRequest);
    return GetUserDataResult.Data;
  }

  this.GetCatalog = function(name) {
    var GetCatalogItemsRequest = {
      "CatalogVersion ": name
    };

    var GetCatalogItemsResults = server.GetCatalogItems(GetCatalogItemsRequest);
    return GetCatalogItemsResults;
  }

  this.GrantItems = function(itemIds)
  {
   	var GrantItemsToUserRequest = {
        "PlayFabId" : currentPlayerId,
        "ItemIds" : itemIds
      };

      var result = server.GrantItemsToUser(GrantItemsToUserRequest);
    	return JSON.stringify(result);
  }

  this.UpdateReadOnlyData = function(data){
    var UpdateUserReadOnlyDataRequest = {
      "PlayFabId":currentPlayerId,
      "Data":data
    };

    server.UpdateUserReadOnlyData(UpdateUserReadOnlyDataRequest);
  }
}
