// inherit UserData
function Building(type, index) {

  Building.prototype = Object.create(UserData.prototype);
  Building.prototype.constructor = UserData;
  UserData.call(this, type + index);

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

    if (this.data == null){
      this.data = {
        "level":0
      };
    }

    this.data.completedDate = this.ServerTime() + 100000;
    this.data.upgrading = true;

    this.Push();
  }

  this.CompleteUpgrade = function(){
  }
}
