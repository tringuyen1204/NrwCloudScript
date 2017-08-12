// inherit UserData
function Building(type, index) {

  UserData.call(this, type + index);

  // default value
  if (this.data.level == null){
    this.data.level = 0;
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
    if (this.TryUpgrade()){
      this.Push();
    }
  }

  this.TryUpgrade =  function(){
    if (this.upgrading){
      log.error(type + index + " is already upgrading!");
      return false;
    }

    this.data.completedDate = this.ServerTime() + 100000;
    this.data.upgrading = true;
    this.level++;

    return true;
  }

  this.CompleteUpgrade = function(){
  }
}

Building.prototype = Object.create(UserData.prototype);
Building.prototype.constructor = UserData;
