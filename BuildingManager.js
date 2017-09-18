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
    if ("command" in args) {
        if (( args.type === GOLD_STORAGE || args.type === FOOD_STORAGE )
            && ( args.command === CMD_COMPLETE_UPGRADE || args.command === CMD_BOOST_UPGRADE )) {

            this.RefreshStorageCap();
        }
    }
    this.PushNow();
};

DataManager.prototype.GetHandler = function (args) {
    var handlers = this.Handlers;
    var type = args.type;

    if (handlers.hasOwnProperty(type)) {

        var newHandler = null;

        switch (type) {
            case FARM:
            case MARKET:
                newHandler = new ResBuildHandler(type);
                break;
            case BARRACK:
                newHandler = new BarrackHandler(type);
                break;
            case CASTLE:
            case FOOD_STORAGE:
            case GOLD_STORAGE:
                newHandler = new BuildingHandler(type);
                break;
        }

        if (handlers === null) {
            log.error("invalid building handler type: +" + type);
            return null;
        }

        handlers[type].Data = this.Data;
    }
    return handlers[type];
};