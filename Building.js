// inherit UserData
function BuildingHandler(type) {

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

    this.StartUpgrade = function(id, date){
        if ( this.TryUpgrade(id, date) ){
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


    this.PrepareUpgrade = function(id, date){
        if (this.Get(id) == null){
            this.Data[id] = this.DefaultData();
        }
    }

    this.TryUpgrade = function(id, date){

        this.PrepareUpgrade(id, date);

        if (this.Get(id).Upgrading){
            log.error("Error: " + type + id + " is already Upgrading!");
            return false;
        }

        if (type == CASTLE){
        }
        else {
            var castle = new BuildingHandler(CASTLE);
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

            this.Get(id).CompletedDate = date + nextLvlData.BuildTime * 1000.0;

            log.info("server complete date = ", this.Get(id).CompletedDate);
            this.Get(id).Upgrading = true;
        }
        else {
            return false;
        }

        return true;
    }

    this.CompleteUpgrade = function(id, date) {
        this.PreCompleteUpgrade(id, date);
        this.Push();
        this.PostCompleteUpgrade(id, date);
    }

    this.FastForward = function(id, date) {

        if (this.Completed(id)) {
            log.error("this building has been completed!");
        } else {

            var remainTime = ( this.Get(id).CompletedDate - date );
            var diamondNeed = ConvertTimeToDiamond(remainTime / 1000.0);

            if (TryUsingCurrency(DIAMOND, diamondNeed)) {
                this.CompleteUpgrade(id);
            }
        }
    }

    this.PreCompleteUpgrade = function(id, date) {

        this.Get(id).Level++;
        this.Get(id).Upgrading = false;

        var kingdom = new Kingdom();
        kingdom.AddExp(this.CurrentLevelData(id).ExpGain);
    }

    this.PostCompleteUpgrade = function(id){
        if (type == GOLD_STORAGE || type == FOOD_STORAGE) {
            this.RefreshStorageCap();
        }
    }

    this.Completed = function (id) {
        return this.Get(id).CompletedDate <= this.ServerTime();
    }

    this.RefreshStorageCap = function () {
        var code = FOOD;

        if (type == GOLD_STORAGE){
            code = GOLD;
        }

        var newCapacity = 0;

        var str = "Castle"+code+"Storage";

        var result = server.GetTitleData([str]).Data[str];

        newCapacity += Number(result);

        for (key in this.Data) {
            newCapacity += this.CurrentLevelData(key)[code + "Capacity"];
        }

        log.info("New " + code + " capacity = " + newCapacity );


        var resMan = new ResourceManager();
        resMan.SetMax(code ,newCapacity);
    }
}

BuildingHandler.prototype = Object.create(UserData.prototype);
BuildingHandler.prototype.constructor = UserData;

function BuildingHandlerFromType(type){

    switch (type) {
        case MARKET:
        case FARM:
            return new ResourceBuildingHandler(type);
        default:
            return new BuildingHandler(type);
    }
}