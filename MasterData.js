function MasterData(key){
  this.key = key;

  var rawData = server.GetCatalogItems({
    "CatalogVersion":key
  });

  if ( "Catalog" in rawData){
    this.data = JSON.parts(rawData.Catalog[0].CustomData);
  }
  else {
    this.data = {};
  }
}
