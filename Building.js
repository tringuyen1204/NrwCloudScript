// inherit UserData
function BuildingHandler(type) {

    this.Type = type;

    UserData.call(this, type);
    // default value

}

BuildingHandler.prototype.GetMasterData = function() {
    if (!("_masterData" in this)) {
        var rawData = server.GetCatalogItems({
            "CatalogVersion": this.Type
        });

        if ("Catalog" in rawData) {
            this._masterData = JSON.parse(rawData.Catalog[0].CustomData);
        }
    }
    return this._masterData;
};

BuildingHandler.prototype.CurrentLevelData = function(id){
    return this.GetMasterData()[String(this.Get(id).Level)];
};

BuildingHandler.prototype.NextLevelData = function(id){
    return this.GetMasterData()[String(this.Get(id).Level + 1)];
};

BuildingHandler.prototype.StartUpgrade = function(id, date){
    if ( this.TryUpgrade(id, date) ){
        this.Push();
        return true;
    }
    return false;
};

BuildingHandler.prototype.DefaultData = function(){
    return {
        "Level":0,
        "Upgrading":false,
        "CompletedDate":0
    }
};


BuildingHandler.prototype.PrepareUpgrade = function(id, date){
    if (this.Get(id) == null){
        this.Data[id] = this.DefaultData();
    }
};

BuildingHandler.prototype.TryUpgrade = function(id, date){

    this.PrepareUpgrade(id, date);

    if (this.Get(id).Upgrading){
        log.error("Error: " + type + id + " is already Upgrading!");
        return false;
    }

    if (this.Type == CASTLE){
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
};

BuildingHandler.prototype.CompleteUpgrade = function(id, date) {
    this.PreCompleteUpgrade(id, date);
    this.Push();
    this.PostCompleteUpgrade(id, date);
};

BuildingHandler.prototype.FastForward = function(id, date) {

    if (this.Completed(id)) {
        log.error("this building has been completed!");
    } else {

        var remainTime = ( this.Get(id).CompletedDate - date );
        var diamondNeed = ConvertTimeToDiamond(remainTime / 1000.0);

        if (TryUsingCurrency(DIAMOND, diamondNeed)) {
            this.CompleteUpgrade(id);
        }
    }
};

BuildingHandler.prototype.PreCompleteUpgrade = function(id, date) {

    this.Get(id).Level++;
    this.Get(id).Upgrading = false;

    var kingdom = new Kingdom();
    kingdom.AddExp(this.CurrentLevelData(id).ExpGain);
};

BuildingHandler.prototype.PostCompleteUpgrade = function(id){
    if (this.Type == GOLD_STORAGE || this.Type == FOOD_STORAGE) {
        this.RefreshStorageCap();
    }
};

BuildingHandler.prototype.Completed = function (id) {
    return this.Get(id).CompletedDate <= this.ServerTime();
};

BuildingHandler.prototype.RefreshStorageCap = function () {
    var code = FOOD;

    if (this.Type == GOLD_STORAGE){
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
};


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

function ResourceBuildingHandler(type){
    BuildingHandler.call(this, type);
}

ResourceBuildingHandler.prototype = Object.create(BuildingHandler.prototype);
ResourceBuildingHandler.prototype.constructor = BuildingHandler;

ResourceBuildingHandler.prototype.PrepareUpgrade = function(id, date){
    if (this.Get(id) == null){
        this.Data[id] = this.DefaultData();
    }
    this.TryCollect(id, date);
};

ResourceBuildingHandler.prototype.PreCompleteUpgrade = function (id, date) {

    this.Get(id).Level++;
    this.Get(id).Upgrading = false;
    this.Get(id).LastCollectDate = date;

    var kingdom = new Kingdom();
    kingdom.AddExp(this.CurrentLevelData(id).ExpGain);
};


ResourceBuildingHandler.prototype.Collect = function(id, date){
    if (this.TryCollect(id, date) ){
        this.Push();
    }
};

ResourceBuildingHandler.prototype.CollectAll = function(date){
    for (var id in this.Data){
        this.TryCollect(id, date);
    }
    this.Push();
};

ResourceBuildingHandler.prototype.TryCollect = function(id, date){

    if (this.Get(id) == null || this.Get(id).Level == 0) {
        return false;
    }

    var code = (type == MARKET) ? GOLD : FOOD;

    var produceRate = this.CurrentLevelData(id).ProduceRate;
    var workingTime = ( date - this.Get(id).LastCollectDate ) / ONE_HOUR ;

    var amount = Math.floor( workingTime * produceRate );
    var capacity = this.CurrentLevelData(id)[code+"Capacity"]; // GoldCapacity or FoodCapacity

    if (amount > capacity){
        amount = capacity;    // product amount can't surpass capacity
    }

    if (amount > 0){

        var resMan = new ResourceManager();

        var curRes = resMan.ValueOf(code);
        var curMax = resMan.MaxOf(code);

        if (amount + curRes > curMax){
            resMan.ChangeValue(code, curMax - curRes);
            amount -= curMax - curRes;
        }
        else {
            resMan.ChangeValue(code, amount);
            amount = 0;
        }

        this.Get(id).LastCollectDate = Math.floor(date - (amount / produceRate) * ONE_HOUR);
        resMan.Push();

        return true;
    }
    else {
        return false;
    }
};