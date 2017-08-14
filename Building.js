// inherit UserData
function Building(type) {

  UserData.call(this, type);
  // default value

  this.Completed = function(id) {
    return this.Get(id).CompletedDate <= this.ServerTime();
  }
  
  this.Count = function(){
    return this.Data.length;
  }

  this.GetMasterData = function(){
    if ( this._masterData == null ){
      this._masterData = new MasterData(type);
    }
    return this._masterData.Data;
  }
  
  this.Get = function(id) {
    var ret = this.Data[id];
    if( ret == null) {
        return {};
    }
    else {
        return ret;
    }
  }

  this.CurrentLevelData = function(id){
    return this.GetMasterData()[this.Get(id).Level];
  }

  this.NextLevelData = function(id){
    return this.GetMasterData()[this.Get(id).Level + 1];
  }

  this.StartUpgrade = function(id){
    if ( this.TryUpgrade(id) ){
      this.Push();
      return true;
    }
    return false;
  }
  
  this.DefaultData = function(){
      return {
          "Level":0,
          "Upgrading":false,
          "CompletedDated":0
      }
  }

  this.TryUpgrade =  function(id){
  
    if (this.Get(id) == null){
        this.Get(id) = this.DefaultData();
    }
  
    if (this.Get(id).Upgrading ){
      log.error(type + id + " is already Upgrading!");
      return false;
    }

    if (type == CASTLE){
    }
    else {
      var castle = new Building(CASTLE);
      if ( Number(id) > castle.CurrentLevelData("0")[type+"Limit"] ){
        return false;
      }
    }

    var nextLvlData = this.NextLevelData(id);

    var missingRes = 0;
    var notEnoughGold = false;
    var notEnoughFood = false;

    if (nextLvlData.GoldCost != null){
      var playerGold = new Resource(GOLD);
      if (playerGold.Value() < nextLvlData.GoldCost){
        missingRes += nextLvlData.GoldCost - playerGold.Value();
        notEnoughGold = true;
      }
    }

    if (nextLvlData.FoodCost != null){
      var playerFood = new Resource(FOOD);
      if (playerFood.Value() < nextLvlData.FoodCost){
        missingRes += nextLvlData.FoodCost - playerFood.Value();
        notEnoughFood = true;
      }
    }

    var diamondNeed = ConvertGoldFoodToDiamond(missingRes);
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

      this.Get(id).CompletedDate = this.ServerTime() + nextLvlData.BuildTime;
      this.Get(id).Upgrading = true;
    }
    else {
      return false;
    }

    return true;
  }

  this.CompleteUpgrade = function(id){
    if ( this.TryComplete(id) ){
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

  this.TryComplete = function(id){
    if ( this.Completed(id) ){
      // TODO update building data
      this.Get(id).Level ++;
      this.Get(id).Upgrading = false;

      // TODO add user exp
      var kingdom = new Kingdom();
      kingdom.AddExp(this.CurrentLevelData().ExpGain);
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
