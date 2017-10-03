function ResHandler(playerId) {
    UpgradeHandler.call(this, [RESOURCE], playerId);

    this.ValueOf = function (id) {
        if (this.Get(id) === null) {
            this.Data[RESOURCE][id] = this.DefaultData();
        }
        return this.Get(id).Value;
    };

    this.DefaultData = function () {
        return {
            "Value": 0,
            "Max": 0
        }
    };

    this.MaxOf = function (id) {
        if (this.Get(id) === null) {
            this.Data[RESOURCE][id] = this.DefaultData();
        }
        return this.Get(id).Max;
    };

    this.Change = function (id, qty) {
        if (this.ValueOf(id) + qty < 0) {
            this.Get(id).Value = 0;
        }
        else if (this.ValueOf(id) + qty > this.MaxOf(id)) {
            this.Get(id).Value = this.MaxOf(id);
        }
        else {
            this.Get(id).Value += qty;
        }
    };

    this.SetMax = function (id, newMax) {
        this.Get(id).Max = newMax;
    };

    this.ApplyRaid = function (args) {
        this.Change(RES.GOLD, Math.floor(-this.ValueOf(RES.GOLD) * args["rate"] * 0.25));
        this.Change(RES.FOOD, Math.floor(-this.ValueOf(RES.FOOD) * args["rate"] * 0.25));
    };
}

ResHandler.prototype = Object.create(UpgradeHandler.prototype);
