function ResBuildHandler(playerId) {
    BuildHandler.call(this, playerId);
    this.base = new BuildHandler();

    this.CompleteUpgrade = function (args) {
        if (this.base.CompleteUpgrade.call(this, args)) {
            this.Get(args.id).CollectDate = args.date;
            return true;
        }
        return false;
    };

    this.DefaultData = function (args) {
        return {
            "Lvl": 0,
            "CollectDate": args.date,
            "Pos": args.position
        }
    };

    this.Run = function (args) {
        var result = this.base.Run.call(this, args);
        if (!result) {
            switch (args.command) {
                case CMD.RESOURCE.COLLECT:
                    result = this.Collect(args);
                    break;
            }
            if (result) {
                this.Push();
            }
        }
        return result;
    };

    this.Upgrade = function (args) {
        this.Collect(args);
        return this.base.Upgrade.call(this, args);
    };

    this.Collect = function (args) {

        var id = args.id;
        var date = args.date;

        var bData = this.Get(id);

        if (bData === null || bData.Lvl === 0 || ("FinishDate" in bData)) {
            return false;
        }

        var code = (this.type === MARKET) ? RES.GOLD : RES.FOOD;
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

    this.CollectAll = function (args) {
        var k;
        for (k in this.Data[this.type]) {
            this.Collect(k, args.date);
        }
        return true;
    };

    this.ProducedResource = function (id, date) {

        var bData = this.Get(id);

        if (bData === null || bData.Lvl === 0 || bData.IsUp) {
            return 0;
        }

        var produceRate = this.CurLvlData(id).ProduceRate;
        var workingTime = ( date - bData.CollectDate ) / HOUR;
        var amount = Math.floor(workingTime * produceRate);

        var code = (this.type === MARKET) ? RES.GOLD : RES.FOOD;

        var capacity = this.CurLvlData(id)[code + "Cap"];

        if (amount > capacity) {
            amount = capacity;
        }
        return amount;
    };

    this.AllResourceByType = function (type, date) {
        var total = 0;
        var k;

        for (k in this.Data[type]) {
            total += this.ProducedResource(k, date);
        }
        return total;
    };

    this.ApplyRaid = function (date, rate) {
        var k;
        for (k in this.Data[this.type]) {
            this.Reduce(k, date, rate);
        }
    };

    this.Reduce = function (id, date, rate) {
        var bData = this.Get(id);
        var produceRate = this.CurLvlData(id).ProduceRate;
        var amount = this.ProducedResource(id, date);

        amount *= (1 - rate);
        bData.CollectDate = Math.floor(date - amount / produceRate * HOUR);
    };

    /**
     *
     * @param args
     * @returns {{ProducedGold: number, ProducedFood: number}}
     * @constructor
     */
    this.AllResource = function (args) {
        var ret = {};
        ret[RES.GOLD] = this.AllResourceByType(MARKET, args.date);
        ret[RES.FOOD] = this.AllResourceByType(FARM, args.date);
        return ret;
    };

}

ResBuildHandler.prototype = Object.create(BuildHandler.prototype);