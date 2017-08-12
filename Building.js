// inherit UserData
function Building(type, index) {

  UserData.call(this, type + index);
  // default value
  if (this.Data.Level == null){
    this.Data.Level = 0;
  }
  this.IsCompleted = function() {
    return this.Data.CompletedDate <= this.ServerTime();
  }

  this.MasterData = function(){
    if ( !("_masterData" in this) ){
      this._masterData = new MasterData(type).Data;
    }
    return this._masterData;
  }

  this.CurrentLevelData = function(){
    if ( (this.Data.Level) == 0 ){
      return null;
    }
    else {
      return this.MasterData()[this.Data.Level];
    }
  }

  this.NextLevelData = function() {
    return this.MasterData()[this.Data.Level + 1];
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
    if (this.Upgrading){
      log.error(type + index + " is already Upgrading!");
      return false;
    }

    this.Data.CompletedDate = this.ServerTime() + 100000;
    this.Data.Upgrading = true;

    var kingdom = new Kingdom();
    kingdom.AddExp(this.NextLevelData().exp_gain);
    //this.Data.masterData = this.NextLevelData();
    return true;
  }

  this.CompleteUpgrade = function(){
    if ( this.IsCompleted() ){
      this.Data.Level ++;
      this.Data.Upgrading = false;

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
