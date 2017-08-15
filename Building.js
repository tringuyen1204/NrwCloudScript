// inherit UserData
function Building(type) {

    this.Type = type;

    UserData.call(this, type);
    // default value

    this.GetMasterData = function() {
        if (!("_masterData" in this)) {
            var rawData = server.GetCatalogItems({
                "CatalogVersion": this.Type
            });

            if ("Catalog" in rawData) {
                this._masterData = JSON.parse(rawData.Catalog[0].CustomData);
            }
        }
        return this._masterData;
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

    this.PrepareUpgrade = function(id){
        // for override;
    }

    this.TryUpgrade = function(id){

        this.PrepareUpgrade(id);

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
            if (resMan.ValueOf(GOLD) < nextLvlData.GoldCost){
                missingRes += nextLvlData.GoldCost - resMan.ValueOf(GOLD);
                notEnoughGold = true;
            }
        }

        if (nextLvlData.FoodCost != null){
            if (resMan.ValueOf(FOOD) < nextLvlData.FoodCost){
                missingRes += nextLvlData.FoodCost - resMan.ValueOf(FOOD);
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
                resMan.ChangeValue(GOLD ,-resMan.ValueOf(GOLD) );
            }
            else if (nextLvlData.GoldCost != null) {
                resMan.ChangeValue(GOLD, -nextLvlData.GoldCost);
            }

            if (notEnoughFood){
                resMan.ChangeValue(FOOD , -resMan.ValueOf(FOOD) );
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

    this.CompleteUpgrade = function(id) {

        this.UpdateCompleteData(id);
        this.Push();

        if (type == CASTLE || type == GOLD_STORAGE) {
            RefreshStorageCap(GOLD);
        }
        if (type == CASTLE || type == FOOD_STORAGE) {
            RefreshStorageCap(FOOD);
        }
    }

    this.FastForward = function(id) {

        if (this.Completed(id)) {
            log.error("this building contruction is already completed");
        }
        else {

            var remainTime = ( this.Get(id).CompletedDate - this.ServerTime() );
            var diamondNeeded = ConvertTimeToDiamond(remainTime / 1000.0);

            if (TryUsingCurrency(DI, diamondNeeded)) {
                this.CompleteUpgrade(id);
            }
        }
    }

    this.UpdateCompleteData = function(id) {

        this.Get(id).Level++;
        this.Get(id).Upgrading = false;

        var kingdom = new Kingdom();
        kingdom.AddExp(this.CurrentLevelData(id).ExpGain);

        return true;
    }
}

Building.prototype.Completed = function(id) {
    return this.Get(id).CompletedDate <= this.ServerTime();
}

Building.prototype.Get = function (id) {
    return this.Data[id];
}

Building.prototype = Object.create(UserData.prototype);
Building.prototype.constructor = UserData;
