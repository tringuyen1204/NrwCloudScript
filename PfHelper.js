var PfHelper = {
  GetReadOnlyData : function(keys) {
    var GetUserDataResult = server.GetUserReadOnlyData( {
        "PlayFabId":currentPlayerId,
        "Keys": keys
    });
    return GetUserDataResult.Data;
  },
  GetCatalog : function(name) {
    var GetCatalogItemsResults = server.GetCatalogItems({
      "CatalogVersion ": name
    });
    return GetCatalogItemsResults;
  },
  GrantItems : function(itemIds)  {
    var result = server.GrantItemsToUser({
        "PlayFabId" : currentPlayerId,
        "ItemIds" : itemIds
    });
  	return JSON.stringify(result);
  },
  UpdateReadOnlyData : function(data) {
    var updateResult = server.UpdateUserReadOnlyData({
      "PlayFabId":currentPlayerId,
      "Data":data
    });
    return JSON.stringify(result);
  }
}
