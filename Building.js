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

    if (type == CASTLE){
    }
    else {
      var castle = new Building(CASTLE, 0);
      if (index > castle.Data.MasterData[type+"Limit"] - 1){
        return false;
      }
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
    log.info("diamond needed = " + diamondNeed);

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
      this.Data.Upgrading = true;
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
