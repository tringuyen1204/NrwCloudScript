function BuildingManager(playerId) {
    this.Handlers = {};
    UserData.call(this, "Building", playerId);

    this.Execute = function (args) {
        var date = this.GetDate(args);

        var handler = this.GetHandler(args.type);
        var canPush = false;

        switch (args.command) {
            case "Upgrade":
                canPush = handler.Upgrade(args.id, date);
                break;
            case "CompleteUpgrade":
                canPush = handler.CompleteUpgrade(args.id, date);
                break;
            case "BoostBuilding":
                canPush = handler.BoostBuilding(args.id, date);
                break;
            case "Build":
                canPush = handler.Build(args.id, date, args.position);
                break;
            case "Collect":
                canPush = handler.Collect(args.id, date);
                break;
            case "ChangeTroop":
                canPush = handler.ChangeTroop(args.id, date, args.troopType);
                break;
            case "BoostTrain":
                canPush = handler.BoostTrain(args.id, date);
                break;
            case "BoostTrainAll":
                canPush = handler.BoostTrainAll(date);
                break;
        }

        if (canPush) {
            this.Push();
        }
    };

    this.GetHandler = function (type) {
        if (!this.Handlers.hasOwnProperty(type)) {
            switch (type) {
                case MARKET:
                case FARM:
                    this.Handlers[type] = new ResourceBuilding(type);
                    break;
                case BARRACK:
                    this.Handlers[type] = new Barrack(type);
                    break;
                default:
                    this.Handlers[type] = new Building(type);
                    break;
            }
            this.Handlers[type].Data = this.Data[type];
        }
        return this.Handlers[type];
    };

    /**
     * @returns {number}
     */
    this.GetDate = function (args) {
        if (args === null || args === undefined || !args.hasOwnProperty("date")) {
            return Date.now();
        }
        return Number(args.date);
    };

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
        this.Push();
    };
}

BuildingManager.prototype = Object.create(UserData.prototype);