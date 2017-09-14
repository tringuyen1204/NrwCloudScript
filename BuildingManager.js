function BuildingManager(playerId) {

    DataManager.call(this, BUILDING, playerId);

    this.AllProduceResource = function (args) {
        var date = this.GetDate(args);
        var pGold = this.GetHandler(MARKET).AllResource(date) * 0.5;
        var pFood = this.GetHandler(FARM).AllResource(date) * 0.5;

        return {
            ProducedGold: Math.floor(pGold),
            ProducedFood: Math.floor(pFood)
        }
    };

    this.ApplyRaid = function (args) {
        var date = this.GetDate(args);
        this.GetHandler(MARKET).ApplyRaid(date, args.rate);
        this.GetHandler(FARM).ApplyRaid(date, args.rate);
        this.PushNow();
    };

    this.Push = function (args) {
        if ((args.type === GOLD_STORAGE || args.type === FOOD_STORAGE)
            && (args.command === COMPLETE_UPGRADE || args.command === BOOST_UPGRADE)) {
            this.RefreshStorageCap();
        }
        this.PushNow();
    };
}

BuildingManager.prototype = Object.create(DataManager.prototype);