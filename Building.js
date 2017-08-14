// inherit UserData
function Building(type) {

  this.Type = type;

  UserData.call(this, type);
  // default value

  this.Completed = function(id) {
    return this.Get(id).CompletedDate <= this.ServerTime();
  }
  
  this.Count = function(){
    return this.Data.length;
  }

  this.GetMasterData = function() {
    if ( !("_masterData" in this) ) {
        var rawData = server.GetCatalogItems({
            "CatalogVersion":this.Type
        });
        
        if ( "Catalog" in rawData){
            this._masterData  = JSON.parse(rawData.Catalog[0].CustomData);
        }
        
        //log.info( JSON.stringify(this._masterData) );
    }
    return this._masterData;
  }
  
  this.Get = function(id) {
    return this.Data[id];
  }

  this.CurrentLevelData = function(id){
    return this.GetMasterData()[String(this.Get(id).Level)];
  }

  this.NextLevelData = function(id){   
    return this.GetMasterData()[String(this.Get(id).Level + 1)];
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
          "CompletedDate":0
      }
  }

  this.TryUpgrade = function(id){
   
    if (this.Get(id) == null){
        this.Data[id] = this.DefaultData();
    }
  
    if (this.Get(id).Upgrading){
      log.error("Error: " + type + id + " is already Upgrading!");
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

    var resMan = new ResourceManager();
   
    if (nextLvlData.GoldCost != null){
      if (resMan.Value(GOLD) < nextLvlData.GoldCost){
        missingRes += nextLvlData.GoldCost - resMan.Value(GOLD);
        notEnoughGold = true;
      }
    }

    if (nextLvlData.FoodCost != null){
      if (resMan.Value(FOOD) < nextLvlData.FoodCost){
        missingRes += nextLvlData.FoodCost - resMan.Value(FOOD);
        notEnoughFood = true;
      }
    }

    var diamondNeed = 0;

    if (missingRes > 0) {
        diamondNeed = ConvertGoldFoodToDiamond(missingRes);
        log.info("diamond needed = " + diamondNeed);
    }

    if ( (diamondNeed == 0)
    || (diamondNeed > 0 && TryUsingCurrency(DIAMOND, diamondNeed) ) ){
      if (notEnoughGold){
        resMan.ChangeValue(GOLD ,-resMan.Value(GOLD) );
      }
      else if (nextLvlData.GoldCost != null) {
        resMan.ChangeValue(GOLD, -nextLvlData.GoldCost);
      }

      if (notEnoughFood){
        resMan.ChangeValue(FOOD , -resMan.Value(FOOD) );
      }
      else if (nextLvlData.FoodCost != null){
        resMan.ChangeValue(FOOD, -nextLvlData.FoodCost);
      }
      
      resMan.Push();

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
