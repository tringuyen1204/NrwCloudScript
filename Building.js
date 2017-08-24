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
    };

    this.CurLvlData = function(id){
        return this.GetMasterData()[String(this.Get(id).Level)];
    };

    this.NxtLvlData = function(id){
        return this.GetMasterData()[String(this.Get(id).Level + 1)];
    };

    this.StartUpgrade = function(id, date){
        if ( this.TryUpgrade(id, date) ){
            this.Push();
            return true;
        }
        return false;
    };

    this.TryUpgrade = function(id, date){

        if (this.Get(id) == null){
            this.Data[id] =  {
                "Level":0,
                "Upgrading":false,
                "CompletedDate":0
            };
        }

        if (this.Get(id).Upgrading){
            log.error("Error: " + this.Type + id + " is already Upgrading!");
            return false;
        }

        if (this.Type == CASTLE){
        }
        else {
            var castle = new BuildingHandler(CASTLE);
            if ( Number(id) > castle.CurLvlData("0")[this.Type+"Limit"] ){
                return false;
            }
        }

        var nextLvlData = this.NxtLvlData(id);

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
            || (diamondNeed > 0 && SpendCurrency(DIAMOND, diamondNeed) ) ){
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

    this.CompleteUpgrade = function(id, date) {
        this.Get(id).Level++;
        this.Get(id).Upgrading = false;

        var kingdom = new Kingdom();
        kingdom.AddExp(this.CurLvlData(id).ExpGain);

        this.Push();

        if (this.Type == GOLD_STORAGE || this.Type == FOOD_STORAGE) {
            this.RefreshStorageCap();
        }
    };

    this.FastForward = function(id, date) {

        if (this.Completed(id)) {
            log.error("this building has been completed!");
        } else {

            var remainTime = ( this.Get(id).CompletedDate - date );
            var diamondNeed = ConvertTimeToDiamond(remainTime / 1000.0);

            if (SpendCurrency(DIAMOND, diamondNeed)) {
                this.CompleteUpgrade(id, date);
            }
        }
    };

    this.Completed = function (id) {
        return this.Get(id).CompletedDate <= this.ServerTime();
    };

    this.RefreshStorageCap = function () {
        var code = FOOD;

        if (this.Type == GOLD_STORAGE){
            code = GOLD;
        }

        var newCapacity = 0;
        var str = "Castle"+code+"Storage";
        var result = server.GetTitleData([str]).Data[str];

        newCapacity += Number(result);

        for (key in this.Data) {
            newCapacity += this.CurLvlData(key)[code + "Capacity"];
        }

        log.info("New " + code + " capacity = " + newCapacity );

        var resMan = new ResourceManager();
        resMan.SetMax(code ,newCapacity);
    };
}

BuildingHandler.prototype = Object.create(UserData.prototype);

function BuildingHandlerFromType(type){

    switch (type) {
        case MARKET:
        case FARM:
            return new ResBuildHandler(type);
        case BARRACK:
            return new BarrackHandler(type);
        default:
            return new BuildingHandler(type);
    }
}