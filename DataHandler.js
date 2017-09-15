DataHandler = function (type) {
    this.type = type;
};
DataHandler.prototype.MasterData = function () {
    if (!("mData" in this)) {
        var rawData = server.GetCatalogItems({
            "CatalogVersion": this.type
        });

        if ("Catalog" in rawData) {
            this.mData = JSON.parse(rawData.Catalog[0].CustomData);
        }
    }
    return this.mData;
};

DataHandler.prototype.Execute = function (args) {
    switch (args.command) {
        case UPGRADE:
            return this.Upgrade(args);
        case COMPLETE_UPGRADE:
            return this.CompleteUpgrade(args);
        case INSTANT_UPGRADE:
            return this.InstantUpgrade(args);
        case BOOST_UPGRADE:
            return this.BoostUpgrade(args);
    }
    return false;
};

DataHandler.prototype.CurLvlData = function (id) {
    return this.MasterData()[String(this.Get(id).Level)];
};

DataHandler.prototype.NxtLvlData = function (id) {
    return this.MasterData()[String(this.Get(id).Level + 1)];
};

DataHandler.prototype.DefaultData = function (args) {
    return {
        "Level": 0,
        "Upgrading": false,
        "CompletedDate": 0
    }
};

DataHandler.prototype.InstantUpgrade = function (args) {
    var id = args.id;
    var date = args.date;

    var nxtLv = this.NxtLvlData(id);

    var missRes = 0;

    if ("GoldCost" in nxtLv) {
        missRes += nxtLv.GoldCost;
    }

    if ("FoodCost" in nxtLv) {
        missRes += nxtLv.FoodCost;
    }

    var cost = Converter.GoldFoodToDiamond(resCost) + Converter.TimeToDiamond(nxtLv.UpTime);
    cost = Math.floor(cost * 0.9);

    var resMan = new ResHandler();

    if (Currency.Spend(DIAMOND, cost)) {
        this.Get(id).Upgrading = true;
        this.CompleteUpgrade(args);
    }
};

DataHandler.prototype.Upgrade = function (args) {

    var id = args.id;
    var date = args.date;

    if (this.Get(id) === null) {
        this.Data[this.type][id] = this.DefaultData(args);
    }

    if (!this.CanUpgrade(id)) {
        return false;
    }

    var nxtLv = this.NxtLvlData(id);

    var missRes = 0;
    var needGold = false;
    var needFood = false;

    var resMan = new ResHandler();

    var data = this.Get(id);

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

        data.CompletedDate = date + nxtLv.UpTime;
        data.Upgrading = true;
        this.GetWorkers().push({
            "type": this.type,
            "Id": id
        });
    }
    else {
        return false;
    }

    return true;
};

DataHandler.prototype.CompleteUpgrade = function (args) {

    var id = args.id;
    var date = args.date;
    var b = this.Get(id);
    b.Level++;
    b.Upgrading = false;

    var kingdom = new Kingdom();
    kingdom.AddExp(this.CurLvlData(id).ExpGain);
    this.RemoveExecutors(this.type, id);
};

DataHandler.prototype.CanUpgrade = function () {
    return this.GetWorkers().length < 2
        || this.Get(id).Upgrading;
};

DataHandler.prototype.BoostUpgrade = function (args) {
    var id = args.id;
    var date = args.date;

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

DataHandler.prototype.Completed = function (id, date) {
    return this.Get(id).CompletedDate <= date;
};

DataHandler.prototype.GetWorkers = function () {
    if (!this.Data.hasOwnProperty("Workers")) {
        this.Data.Workers = [];
    }
    return this.Data.Workers;
};

DataHandler.prototype.RemoveExecutors = function (type, id) {

    var executors = this.GetWorkers();
    var index = -1;
    for (var a = 0; a < executors.length; a++) {
        var data = executors[a];
        if (data.Id === id && data.type === type) {
            index = a;
            break;
        }
    }
    if (index !== -1) {
        executors.splice(index, 1);
    }
};

DataHandler.prototype.Get = function (id) {
    if (this.Data[this.type].hasOwnProperty(id)) {
        return this.Data[this.type][id];
    }
    else {
        return null;
    }
};