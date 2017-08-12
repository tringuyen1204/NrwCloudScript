function ResourceBuilding(type, index){
  Building.call(this, type, index);

  // default value
  if (this.Data.lastCollectDate == null){
    this.Data.lastCollectDate = Date.now();
  }
}
ResourceBuilding.prototype = Object.create(Building.prototype);
ResourceBuilding.prototype.constructor = Building;
