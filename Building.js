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

  this.MasterData = function(){
    if ( !("_masterData" in this) ){
      this._masterData = new MasterData(type);
    }
    return this._masterData;
  }

  this.CurrentLevelData = function(){
    if (this.data.level) == 0{
      return null;
    }
    else {
      return this.MasterData()[this.data.level];
    }
  }

  this.NextLevelData = function() {
    return this.MasterData()[this.data.level + 1];
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

    this.data.masterdata = JSON.stringify( this.NextLevelData() );

    return true;
  }

  this.CompleteUpgrade = function(){
    if ( this.IsCompleted() ){
      this.data.level ++;
      this.data.upgrading = false;

      // TODO add user exp
      this.Push();

      return true;
    }
    else {
      log.error("this building construction is not completed");
      return false;
    }
  }
}

Building.prototype = Object.create(UserData.prototype);
Building.prototype.constructor = UserData;
