function ResourceBuilding(type) {
    Building.call(this, type);

    this.PreComplete = function (id, date) {
        var bData = this.Get(id);
        bData.CollectDate = date;
    };

    this.DefaultData = function (date, pos) {
        return {
            "Level": 0,
            "Upgrading": false,
            "CompletedDate": 0,
            "CollectDate": date,
            "Position": pos
        }
    };

    /**
     * @returns {boolean}
     */
    this.PrepareUprade = function (id, date) {
        this.Collect(id, date);
    };

    /**
     * @returns {boolean}
     */
    this.Collect = function (id, date) {
        var bData = this.Get(id);

        if (bData === null || bData.Level === 0 || bData.Upgrading) {
            return false;
        }

        var code = (this.Type === MARKET) ? GOLD : FOOD;
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

            bData.CollectDate = Math.floor(date - (amount / produceRate) * ONE_HOUR);

            return true;
        }
        else {
            return false;
        }
    };

    this.CollectAll = function (date) {
        var k;
        for (k in this.Data) {
            this.Collect(k, date);
        }
        return true;
    };

    /**
     * @returns {number}
     */
    this.ProducedResource = function (id, date) {

        var bData = this.Get(id);

        if (bData === null || bData.Level === 0 || bData.Upgrading) {
            return 0;
        }

        var produceRate = this.CurLvlData(id).ProduceRate;
        var workingTime = ( date - bData.CollectDate ) / ONE_HOUR;
        var amount = Math.floor(workingTime * produceRate);

        var code = (this.Type === MARKET) ? GOLD : FOOD;

        var capacity = this.CurLvlData(id)[code + "Capacity"];

        if (amount > capacity) {
            amount = capacity;
        }
        return amount;
    };

    /**
     * @returns {number}
     */
    this.AllResource = function (date) {
        var total = 0;
        var k;

        for (k in this.Data) {
            total += this.ProducedResource(k, date);
        }
        return total;
    };

    this.ApplyRaid = function (date, rate) {
        var k;
        for (k in this.Data) {
            this.ReduceProduction(k, date, rate);
        }
    };

    this.ReduceProduction = function (id, date, rate) {
        var bData = this.Get(id);

        var code = (this.Type === MARKET) ? GOLD : FOOD;
        var produceRate = this.CurLvlData(id).ProduceRate;
        var amount = this.ProducedResource(id, date);

        amount *= (1 - rate);
        bData.CollectDate = Math.floor(date - amount / produceRate * ONE_HOUR);
    };
}

ResourceBuilding.prototype = Object.create(Building.prototype);