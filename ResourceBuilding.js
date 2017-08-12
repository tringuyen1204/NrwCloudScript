function ResourceBuilding(type, index){
  Building.call(this, type, index);

  // default value
  if (this.data.lastCollectDate == null){
    this.data.lastCollectDate = Date.now();
  }
}

ResourceBuilding.prototype = Object.create(Building.prototype);
ResourceBuilding.prototype.constructor = Building;
