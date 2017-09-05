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

    this.Build = function (id, date, position) {

        if (this.Get(id) == null){
            this.Data[id] = this.DefaultData(date, position);
        }

        if ( this.TryUpgrade(id, date) ){
            this.Push();
            return true;
        }
        return false;
    };

    this.DefaultData = function (date, position) {
        return {
            "Level":0,
            "Upgrading":false,
            "CompletedDate":0,
            "Position":position
        }
    }

    this.Upgrade = function(id, date){

        if (this.Get(id) == null){
            log.error("Error: " + this.Type + id + " doesn't exist!");
            return false;
        }

        if ( this.TryUpgrade(id, date) ){
            this.Push();
            return true;
        }
        return false;
    };

    this.TryUpgrade = function(id, date){

        if (this.Get(id).Upgrading){
            log.error("Error: " + this.Type + id + " is already upgrading!");
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

        var nxtLv = this.NxtLvlData(id);

        var missingRes = 0;
        var notEnoughGold = false;
        var notEnoughFood = false;

        var resMan = new ResHandler();

        if (nxtLv.GoldCost != null){
            if (resMan.ValueOf(GOLD) < nxtLv.GoldCost){
                missingRes += nxtLv.GoldCost - resMan.ValueOf(GOLD);
                notEnoughGold = true;
            }
        }

        if (nxtLv.FoodCost != null){
            if (resMan.ValueOf(FOOD) < nxtLv.FoodCost){
                missingRes += nxtLv.FoodCost - resMan.ValueOf(FOOD);
                notEnoughFood = true;
            }
        }

        var boostCost = 0;

        if (missingRes > 0) {
            boostCost = ConvertGoldFoodToDiamond(missingRes);
            log.info("diamond needed = " + boostCost);
        }

        if ( (boostCost == 0)
            || (boostCost > 0 && SpendCurrency(DIAMOND, boostCost) ) ){
            if (notEnoughGold){
                resMan.Change(GOLD ,-resMan.ValueOf(GOLD) );
            }
            else if (nxtLv.GoldCost != null) {
                resMan.Change(GOLD, -nxtLv.GoldCost);
            }

            if (notEnoughFood){
                resMan.Change(FOOD , -resMan.ValueOf(FOOD) );
            }
            else if (nxtLv.FoodCost != null){
                resMan.Change(FOOD, -nxtLv.FoodCost);
            }

            resMan.Push();

            this.Get(id).CompletedDate = date + nxtLv.BuildTime * 1000.0;

            log.info("server complete date = ", this.Get(id).CompletedDate);
            this.Get(id).Upgrading = true;
        }
        else {
            return false;
        }

        return true;
    };

    this.CompleteUpgrade = function(id, date) {
        var bData = this.Get(id);
        bData.Level++;
        bData.Upgrading = false;

        var kingdom = new Kingdom();
        kingdom.AddExp(this.CurLvlData(id).ExpGain);

        this.Push();

        if (this.Type == GOLD_STORAGE || this.Type == FOOD_STORAGE) {
            this.RefreshStorageCap();
        }
    };

    this.BoostBuilding = function(id, date) {

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

        var newMax = 0;
        var str = "Castle"+code+"Storage";
        var result = server.GetTitleData([str]).Data[str];

        newMax += Number(result);

        for (key in this.Data) {
            newMax += this.CurLvlData(key)[code + "Capacity"];
        }

        log.info("New " + code + " capacity = " + newMax );

        var resMan = new ResHandler();
        resMan.SetMax(code ,newMax);
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