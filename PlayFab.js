var PlayFab = function(){
  this.GetReadOnlyData = function(keys) {
    var GetUserDataResult = server.GetUserReadOnlyData({
        "PlayFabId":currentPlayerId,
        "Keys": keys
    });
    return GetUserDataResult.Data;
  }

  this.GetCatalog = function(name) {
    var GetCatalogItemsResults = server.GetCatalogItems({
      "CatalogVersion ": name
    });
    return GetCatalogItemsResults;
  }

  this.GrantItems = function(itemIds)  {
    var result = server.GrantItemsToUser({
        "PlayFabId" : currentPlayerId,
        "ItemIds" : itemIds
    });
  	return JSON.stringify(result);
  }

  this.UpdateReadOnlyData = function(data) {
    var updateResult = server.UpdateUserReadOnlyData({
      "PlayFabId":currentPlayerId,
      "Data":data
    });
    return JSON.stringify(result);
  }

  this.Time = function(){
    return new Date(server.GetTime().Time).getTime();
  }
}
