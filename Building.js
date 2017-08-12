// inherit UserData
function Building(type, index) {

  UserData.call(this, type + index);
  // default value
  if (this.Data.Level == null){
    this.Data.Level = 0;
  }
  this.Completed = function() {
    return this.Data.CompletedDate <= this.ServerTime();
  }

  this.GetMasterData = function(){
    if ( !("_masterData" in this) ){
      this._masterData = new MasterData(type).Data;
    }
    return this._masterData;
  }

  this.StartUpgrade = function(){
    if (this.TryUpgrade()){

      this.Push();

      return true;
    }

    return false;
  }

  this.TryUpgrade =  function(){
    if (this.Upgrading){
      log.error(type + index + " is already Upgrading!");
      return false;
    }
    this.Data.CompletedDate = this.ServerTime() + 100000;
    this.Data.Upgrading = false;
    this.Data.Level ++;
    this.Data.MasterData = this.GetMasterData()[this.Data.Level];
    this.Data.NextLevelData = this.GetMasterData()[this.Data.Level + 1];

    return true;
  }

  this.TryComplete = function(){
    if ( this.Completed() ){

      // TODO update building data
      this.Data.Level ++;
      this.Data.Upgrading = false;

      // TODO add user exp
      var kingdom = new Kingdom();
      kingdom.AddExp(this.NextLevel().ExpGain);
      return true;
    }
    else {
      log.error("this building construction is not completed");
      return false;
    }
  }

  this.CompleteUpgrade = function(){
    if ( this.TryComplete() ){
      this.Push();

      if (type == CASTLE || type == GOLD_STORAGE){
        RefreshStorageCap(GOLD);
      }

      if (type == CASTLE || type == FOOD_STORAGE){
        RefreshStorageCap(FOOD);
      }

      return true;
    }
    else {
      return false;
    }
  }
}

Building.prototype = Object.create(UserData.prototype);
Building.prototype.constructor = UserData;
