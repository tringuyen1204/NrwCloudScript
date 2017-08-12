function ResourceBuilding(type, index){
  Building.call(this, type, index);
  this.data.lastCollectDate = Date.now();
}
