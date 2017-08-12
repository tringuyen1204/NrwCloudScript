function Building(type, index) {
  this.key = type + index;
  this.data = GetUserData(this.key);
  if ( this.data == null ){
    // set default data
    this.data = {
      "level":0,
      "completedDate":0,
      "upgrading":false
    }
  }

  this.IsCompleted = function() {
    return this.data.completedDate <= this.ServerTime();
  }

  this.CurrentLevelData = function(){
    if ( !("_curLvlData" in this) ) {
    }
  }

  this.NextLevelData = function() {
    if ( !("_nextLvlData" in this) ) {
    }
  }

  this.ServerTime = function(){
    return Date.now();
  }

  this.StartUpgrade = function(){
    if( this.upgrading ){
      log.error(type + index + " is already upgrading!");
    }

    this.data.completedDate = this.ServerTime() + 100000;
    this.data.upgrading = true;

    UpdateUserData(this);
  }

  this.CompleteUpgrade = function(){
  }
}

function ResourceBuilding(type, index){
  Building.call(this, type, index);
  this.data.lastCollectDate = Date.now();
}
