BuildingManager = function (playerId) {
    DataManager.call(this, BUILDING, playerId);
};

BuildingManager.prototype = Object.create(DataManager.prototype);

BuildingManager.prototype.ProducedResource = function (args) {
    var date = this.FormatData(args);
    var pGold = this.GetHandler(MARKET).AllResource(date) * 0.5;
    var pFood = this.GetHandler(FARM).AllResource(date) * 0.5;

    return {
        ProducedGold: Math.floor(pGold),
        ProducedFood: Math.floor(pFood)
    }
};

BuildingManager.prototype.ApplyRaid = function (args) {
    var date = this.FormatData(args);
    this.GetHandler(MARKET).ApplyRaid(date, args.rate);
    this.GetHandler(FARM).ApplyRaid(date, args.rate);
    this.PushNow();
};

BuildingManager.prototype.Push = function (args) {
    if ((args.type === GOLD_STORAGE || args.type === FOOD_STORAGE)
        && (args.command === COMPLETE_UPGRADE || args.command === BOOST_UPGRADE)) {
        this.RefreshStorageCap();
    }
    this.PushNow();
};