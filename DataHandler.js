DataHandler = function (type) {
    this.type = type;
};

DataHandler.prototype.MasterData = function () {
    if (!("mData" in this)) {
        this.mData = TitleData.Get(this.type);
    }
    return this.mData;
};

DataHandler.prototype.Execute = function (args) {
    switch (args.command) {
        case CMD_UPGRADE:
            return this.Upgrade(args);
        case CMD_COMPLETE_UPGRADE:
            return this.CompleteUpgrade(args);
        case CMD_INSTANT_UPGRADE:
            return this.InstantUpgrade(args);
        case CMD_BOOST_UPGRADE:
            return this.BoostUpgrade(args);
    }
    return false;
};

DataHandler.prototype.CurLvlData = function (id) {
    return this.MasterData()[String(this.GetConstant(id).Level)];
};

DataHandler.prototype.NxtLvlData = function (id) {
    return this.MasterData()[String(this.GetConstant(id).Level + 1)];
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
        this.GetConstant(id).Upgrading = true;
        this.CompleteUpgrade(args);
    }
};

DataHandler.prototype.Upgrade = function (args) {

    var id = args.id;
    var date = args.date;

    if (this.GetConstant(id) === null) {
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

    var data = this.GetConstant(id);

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
        this.AddWorkder(this.type, id);
    }
    else {
        return false;
    }

    return true;
};

DataHandler.prototype.CompleteUpgrade = function (args) {

    var id = args.id;
    var data = this.GetConstant(id);
    data.Level++;
    data.Upgrading = false;

    var kingdom = new Kingdom();
    kingdom.AddExp(this.CurLvlData(id).Exp);
    this.RemoveWorker(this.type, id);
};

DataHandler.prototype.CanUpgrade = function () {

    if (this.GetWorkers().length > 1) {
        log.error("Max worker reaches");
        return false;
    }
    else if (this.GetConstant(id).Upgrading) {
        log.error("Upgrading in progress");
        return false;
    }
    return true;
};

DataHandler.prototype.BoostUpgrade = function (args) {
    var id = args.id;
    var date = args.date;

    if (this.Completed(id, date)) {
        log.error("this building has been completed!");
    } else {

        var remainTime = ( this.GetConstant(id).CompletedDate - date );
        var diamondNeed = Converter.TimeToDiamond(remainTime);

        if (Currency.Spend(DIAMOND, diamondNeed)) {
            return this.CompleteUpgrade(id, date);
        }
    }
    return false;
};

DataHandler.prototype.Completed = function (id, date) {
    return this.GetConstant(id).CompletedDate <= date;
};

DataHandler.prototype.AddWorkder = function (type, id) {
    this.GetWorkers().push({
        "type": this.type,
        "Id": id
    });
};

DataHandler.prototype.GetWorkers = function () {
    if (!this.Data.hasOwnProperty("Workers")) {
        this.Data.Workers = [];
    }
    return this.Data.Workers;
};

DataHandler.prototype.RemoveWorker = function (type, id) {

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

DataHandler.prototype.GetConstant = function (id) {
    if (this.Data[this.type].hasOwnProperty(id)) {
        return this.Data[this.type][id];
    }
    else {
        return null;
    }
};