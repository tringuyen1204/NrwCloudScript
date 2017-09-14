function DataHandler(type) {
    this.Type = type;

    this.MasterData = function () {
        if (!("mData" in this)) {
            var rawData = server.GetCatalogItems({
                "CatalogVersion": this.Type
            });

            if ("Catalog" in rawData) {
                this.mData = JSON.parse(rawData.Catalog[0].CustomData);
            }
        }
        return this.mData;
    };

    this.CurLvlData = function (id) {
        return this.MasterData()[String(this.Get(id).Level)];
    };

    this.NxtLvlData = function (id) {
        return this.MasterData()[String(this.Get(id).Level + 1)];
    };

    this.Create = function (id, date, position) {
        if (this.Get(id) === null) {
            this.Data[id] = this.DefaultData(date, position);
        }
        return this.TryUpgrade(id, date);
    };

    this.Upgrade = function (id, date) {
        this.PrepareUpgrade(id, date);
        return this.TryUpgrade(id, date);
    };

    this.DefaultData = function (date, position) {
        return {
            "Level": 0,
            "Upgrading": false,
            "CompletedDate": 0,
        }
    };

    this.PrepareUpgrade = function (id, date) {
        // do nothing, for override
    };

    this.TryUpgrade = function (id, date) {

        if (!this.CanUpgrade(id)) {
            return false;
        }

        var nxtLv = this.NxtLvlData(id);

        var missRes = 0;
        var needGold = false;
        var needFood = false;

        var resMan = new ResHandler();

        if (nxtLv.GoldCost !== null) {
            if (resMan.ValueOf(GOLD) < nxtLv.GoldCost) {
                missRes += nxtLv.GoldCost - resMan.ValueOf(GOLD);
                needGold = true;
            }
        }

        if (nxtLv.FoodCost !== null) {
            if (resMan.ValueOf(FOOD) < nxtLv.FoodCost) {
                missRes += nxtLv.FoodCost - resMan.ValueOf(FOOD);
                needFood = true;
            }
        }

        var cost = 0;

        if (missRes > 0) {
            cost = Converter.GoldFoodToDiamond(missRes);
            log.info("diamond needed = " + cost);
        }

        if ((cost === 0)
            || (cost > 0 && Currency.Spend(DIAMOND, cost) )) {
            if (needGold) {
                resMan.Change(GOLD, -resMan.ValueOf(GOLD));
            }
            else if (nxtLv.GoldCost !== null) {
                resMan.Change(GOLD, -nxtLv.GoldCost);
            }

            if (needFood) {
                resMan.Change(FOOD, -resMan.ValueOf(FOOD));
            }
            else if (nxtLv.FoodCost !== null) {
                resMan.Change(FOOD, -nxtLv.FoodCost);
            }

            resMan.Push();

            this.Get(id).CompletedDate = date + nxtLv.BuildTime;

            log.info("server complete date = ", this.Get(id).CompletedDate);
            this.Get(id).Upgrading = true;

            this.GetExecutors().push({
                "Type": this.Type,
                "Id": id
            });
        }
        else {
            return false;
        }

        return true;
    };

    this.PreComplete = function (id, date) {
        // do nothing
    };

    this.CompleteUpgrade = function (id, date) {
        this.PreComplete();
        var b = this.Get(id);
        b.Level++;
        b.Upgrading = false;

        var kingdom = new Kingdom();
        kingdom.AddExp(this.CurLvlData(id).ExpGain);
        this.RemoveExecutors(this.Type, id);
    };

    this.CanUpgrade = function () {
        return this.GetExecutors().length < 2
            || this.Get(id).Upgrading;
    };

    this.BoostUpgrade = function (id, date) {

        if (this.Completed(id, date)) {
            log.error("this building has been completed!");
        } else {

            var remainTime = ( this.Get(id).CompletedDate - date );
            var diamondNeed = Converter.TimeToDiamond(remainTime);

            if (Currency.Spend(DIAMOND, diamondNeed)) {
                return this.CompleteUpgrade(id, date);
            }
        }
        return false;
    };

    this.Completed = function (id, date) {
        return this.Get(id).CompletedDate <= date;
    };

    this.GetExecutors = function () {
        if (!this.Data.hasOwnProperty("Executors")) {
            this.Data.Executors = [];
        }
        return this.Data.Executors;
    };

    this.RemoveExecutors = function (type, id) {

        var executors = this.GetExecutors();
        var index = -1;
        for (var a = 0; a < executors.length; a++) {
            var data = executors[a];
            if (data.Id === id && data.Type === type) {
                index = a;
                break;
            }
        }
        if (index !== -1) {
            executors.splice(index, 1);
        }
    };

    this.Get = function (id) {
        if (this.Data[this.Type].hasOwnProperty(id)) {
            return this.Data[this.Type][id];
        }
        else {
            return null;
        }
    };
}