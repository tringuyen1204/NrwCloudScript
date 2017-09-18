ResBuildHandler = function (type) {
    BuildingHandler.call(this, type);
};

ResBuildHandler.prototype = Object.create(BuildingHandler.prototype);

ResBuildHandler.prototype.CompleteUpgrade = function (args) {
    this.Get(args.id).CollectDate = args.date;
    return BuildingHandler.prototype.CompleteUpgrade.call(this, args);
};

ResBuildHandler.prototype.DefaultData = function (args) {
    return {
        "Level": 0,
        "Upgrading": false,
        "CompletedDate": 0,
        "CollectDate": args.date,
        "Position": args.position
    }
};

ResBuildHandler.prototype.Execute = function (args) {
    var ret = BuildingHandler.prototype.Execute.call(this, args);
    if (!ret) {
        switch (args.command) {
            case CMD_COLLECT:
                return handler.Collect(args);
        }
    }
    return ret;
};

ResBuildHandler.prototype.Upgrade = function (args) {
    this.Collect(args.id, args.date);
    return BuildingHandler.prototype.Upgrade.call(this, args);
};

ResBuildHandler.prototype.Collect = function (args) {

    var id = args.id;
    var date = args.date;

    var bData = this.Get(id);

    if (bData === null || bData.Level === 0 || bData.Upgrading) {
        return false;
    }

    var code = (this.type === MARKET) ? GOLD : FOOD;
    var produceRate = this.CurLvlData(id).ProduceRate;
    var amount = this.ProducedResource(id, date);

    if (amount > 0) {

        var resMan = new ResHandler();

        var curRes = resMan.ValueOf(code);
        var curMax = resMan.MaxOf(code);

        if (amount + curRes > curMax) {
            resMan.Change(code, curMax - curRes);
            amount -= curMax - curRes;
        }
        else {
            resMan.Change(code, amount);
            amount = 0;
        }

        bData.CollectDate = Math.floor(date - (amount / produceRate) * HOUR);

        return true;
    }
    else {
        return false;
    }
};

ResBuildHandler.prototype.CollectAll = function (args) {
    var k;
    for (k in this.Data) {
        this.Collect(k, args.date);
    }
    return true;
};

ResBuildHandler.prototype.ProducedResource = function (id, date) {

    var bData = this.Get(id);

    if (bData === null || bData.Level === 0 || bData.Upgrading) {
        return 0;
    }

    var produceRate = this.CurLvlData(id).ProduceRate;
    var workingTime = ( date - bData.CollectDate ) / HOUR;
    var amount = Math.floor(workingTime * produceRate);

    var code = (this.type === MARKET) ? GOLD : FOOD;

    var capacity = this.CurLvlData(id)[code + "Capacity"];

    if (amount > capacity) {
        amount = capacity;
    }
    return amount;
};

ResBuildHandler.prototype.AllResource = function (date) {
    var total = 0;
    var k;

    for (k in this.Data) {
        total += this.ProducedResource(k, date);
    }
    return total;
};

ResBuildHandler.prototype.ApplyRaid = function (date, rate) {
    var k;
    for (k in this.Data) {
        this.ReduceProduction(k, date, rate);
    }
};

ResBuildHandler.prototype.ReduceProduction = function (id, date, rate) {
    var bData = this.Get(id);

    var code = (this.type === MARKET) ? GOLD : FOOD;
    var produceRate = this.CurLvlData(id).ProduceRate;
    var amount = this.ProducedResource(id, date);

    amount *= (1 - rate);
    bData.CollectDate = Math.floor(date - amount / produceRate * HOUR);
};