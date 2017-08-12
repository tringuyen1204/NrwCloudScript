function MasterData(key){
  this.key = key;

  var rawData = server.GetCatalogItems({
    "CatalogVersion":key
  });

  if ( "Catalog" in rawData){
    this.data = JSON.parse(rawData.Catalog);
  }
  else {
    this.data = {};
  }
}
