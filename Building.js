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

  this.NextLevel = function(){
    return this.GetMasterData()[String(this.Data.Level + 1)];
  }

  // the shell logic of building upgrading
  // push data to database
  this.StartUpgrade = function(){
    if (this.TryUpgrade()){
      this.Push();
      return true;
    }
    return false;
  }

  // main logics of upgrading
  // intended to be overrided by children class
  this.TryUpgrade =  function(){
    if (this.Upgrading){
      log.error(type + index + " is already Upgrading!");
      return false;
    }

    var nextLvlData = this.NextLevel();

    var missingResources = 0;
    var notEnoughGold = false;
    var notEnoughFood = false;

    if (nextLvlData.GoldCost != null){
      var playerGold = new Resource(GOLD);
      if (playerGold.Value() < nextLvlData.GoldCost){
        missingResources += nextLvlData.GoldCost - playerGold.Value();
        notEnoughGold = true;
      }
    }

    if (nextLvlData.FoodCost != null){
      var playerFood = new Resource(FOOD);
      if (playerFood.Value() < nextLvlData.FoodCost){
        missingResources += nextLvlData.FoodCost - playerFood.Value();
        notEnoughFood = true;
      }
    }

    var diamondNeed = ConvertGoldFoodToDiamond(missingResources);

    if ( (diamondNeed == 0)
    || (diamondNeed > 0 && TryUsingCurrency(DIAMOND, diamondNeed) ) ){
      if (notEnoughGold){
        playerGold.Change(-playerGold.Value());
      }
      else if (nextLvlData.GoldCost != null) {
        playerGold.Change(-nextLvlData.GoldCost);
      }

      if (notEnoughFood){
        playerFood.Change(-playerFood.Value());
      }
      else if (nextLvlData.FoodCost != null){
        playerFood.Change(-nextLvlData.FoodCost);
      }

      this.Data.CompletedDate = this.ServerTime() + nextLvlData.BuildTime;
      this.Data.Upgrading = false;
    }
    else {
      return false;
    }

    return true;
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

  // check if this building can be completed and
  // process the logics
  this.TryComplete = function(){
    if ( this.Completed() ){

      // TODO update building data
      this.Data.MasterData = this.NextLevel();
      this.Data.Level ++;
      this.Data.Upgrading = false;

      // TODO add user exp
      var kingdom = new Kingdom();
      kingdom.AddExp(this.Data.MasterData.ExpGain);
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
