function MasterData(key){
  this.Key = key;

  var rawData = server.GetCatalogItems({
    "CatalogVersion":this.Key
  });
  if ( "Catalog" in rawData){
    this.Data = JSON.parse(rawData.Catalog[0].CustomData);
  }
  else {
    this.Data = {};
  }
}
