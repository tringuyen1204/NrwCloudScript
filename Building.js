function Building() {
    //this.PlayerId = playerId !== null ? playerId : currentPlayerId;
    this.Handlers = {};
    UserData.call(this, "Building");

    this.GetHandler = function (type) {
        if (this.Handlers.hasOwnProperty(type)) {
            return this.Handlers[type];
        }
        else {
            switch (type) {
                case MARKET:
                case FARM:
                    this.Handlers[type] = new ResBuilding(type);
                    break;
                case BARRACK:
                    this.Handlers[type] = new Barrack(type);
                    break;
                default:
                    this.Handlers[type] = new BuildingHandler(type);
                    break;
            }
        }

        this.Handlers[type].Data = this.Data[type];
        return this.Handlers[type];
    };

    this.Upgrade = function (args) {
        args = this.Check(args);
        var handler = this.GetHandler(args.type);

        if (handler.Upgrade(args.id, Number(args.date))) {
            this.Push();
        }
    };

    this.Build = function (args) {
        args = this.Check(args);
        var handler = this.GetHandler(args.type);
        if (handler.Build(args.id, Number(args.date), args.position)) {
            this.Push();
        }
    };

    this.CompleteUpdate = function (args) {
        args = this.Check(args);
        var handler = this.GetHandler(args.type);
        if (handler.CompleteUpdate(args.id, Number(args.date))) {
            this.Push();
        }
    };

    this.BoostBuilding = function (args) {
        args = this.Check(args);
        var handler = this.GetHandler(args.type);
        if (handler.BoostBuilding(args.id, Number(args.date))) {
            this.Push();
        }
    };

    this.Collect = function (args) {
        args = this.Check(args);
        var handler = this.GetHandler(args.type);
        if (handler.BoostBuilding(args.id, Number(args.date))) {
            this.Push();
        }
    };

    this.Check = function (args) {
        if (!args.hasOwnProperty("date")) {
            args.date = Date.now();
        }
        return args;
    }
}

Building.prototype = Object.create(UserData.prototype);

// inherit UserData
function BuildingHandler(type) {
    this.Type = type;

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

    /**
     * @returns {boolean}
     */
    this.Build = function (id, date, position) {

        if (this.Get(id) === null) {
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
    };

    /**
     * @returns {boolean}
     */
    this.Upgrade = function(id, date){

        if (this.Get(id).Upgrading){
            log.error("Error: " + this.Type + id + " is already upgrading!");
            return false;
        }

        // if (this.Type === CASTLE) {
        // }
        // else {
        //     var castle = this.GetBui
        //     if ( Number(id) > castle.CurLvlData("0")[this.Type+"Limit"] ){
        //         return false;
        //     }
        // }

        var nxtLv = this.NxtLvlData(id);

        var missingRes = 0;
        var notEnoughGold = false;
        var notEnoughFood = false;

        var resMan = new ResHandler();

        if (nxtLv.GoldCost !== null) {
            if (resMan.ValueOf(GOLD) < nxtLv.GoldCost){
                missingRes += nxtLv.GoldCost - resMan.ValueOf(GOLD);
                notEnoughGold = true;
            }
        }

        if (nxtLv.FoodCost !== null) {
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

        if ((boostCost === 0)
            || (boostCost > 0 && SpendCurrency(DIAMOND, boostCost) ) ){
            if (notEnoughGold){
                resMan.Change(GOLD ,-resMan.ValueOf(GOLD) );
            }
            else if (nxtLv.GoldCost !== null) {
                resMan.Change(GOLD, -nxtLv.GoldCost);
            }

            if (notEnoughFood){
                resMan.Change(FOOD , -resMan.ValueOf(FOOD) );
            }
            else if (nxtLv.FoodCost !== null) {
                resMan.Change(FOOD, -nxtLv.FoodCost);
            }

            resMan.Push();

            this.Get(id).CompletedDate = date + nxtLv.BuildTime;

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

        if (this.Type === GOLD_STORAGE || this.Type === FOOD_STORAGE) {
            this.RefreshStorageCap();
        }
    };

    /**
     * @returns {boolean}
     */
    this.BoostBuilding = function(id, date) {

        if (this.Completed(id, date)) {
            log.error("this building has been completed!");
        } else {

            var remainTime = ( this.Get(id).CompletedDate - date );
            var diamondNeed = ConvertTimeToDiamond(remainTime);

            if (SpendCurrency(DIAMOND, diamondNeed)) {
                return this.CompleteUpgrade(id, date);
            }
        }
        return false;
    };

    /**
     * @returns {boolean}
     */
    this.Completed = function (id, date) {
        return this.Get(id).CompletedDate <= date;
    };

    this.RefreshStorageCap = function (code) {

        if (code === null) {
            code = this.Type === GOLD_STORAGE ? GOLD : FOOD;
        }

        var newMax = 0;
        var str = "Castle"+code+"Storage";
        var result = server.GetTitleData([str]).Data[str];

        newMax += Number(result);

        var k;
        for (k in this.Data) {
            if (this.Data.hasOwnProperty(k)) {
                newMax += this.CurLvlData(k)[code + "Capacity"];
            }
        }

        log.info("New " + code + " capacity = " + newMax );

        var resMan = new ResHandler();
        resMan.SetMax(code ,newMax);
    };

    /**
     * @returns {data}
     */
    this.Get = function (id) {
        if (this.Data.hasOwnProperty(id)) {
            return this.Data[id];
        }
        else {
            return null;
        }
    };

    /**
     * @returns {number}
     */
    this.ServerTime = function () {
        return Date.now();
    };
}