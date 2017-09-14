function BuildingManager(playerId) {
    this.Handlers = {};
    UserData.call(this, BUILDING, playerId);

    this.Execute = function (args) {
        var date = this.GetDate(args);
        var handler = this.GetHandler(args.type);
        var canPush = false;

        switch (args.command) {
            case UPGRADE:
                canPush = handler.Upgrade(args.id, date);
                break;
            case COMPLETE_UPGRADE:
                canPush = handler.CompleteUpgrade(args.id, date);
                break;
            case BOOST_UPGRADE:
                canPush = handler.BoostUpgrade(args.id, date);
                break;
            case BUILD:
                canPush = handler.Create(args.id, date, args.position);
                break;
            case COLLECT:
                canPush = handler.Collect(args.id, date);
                break;
            case CHANGE_TROOP:
                canPush = handler.ChangeTroop(args.id, date, args.troopType);
                break;
            case BOOST_TRAIN:
                canPush = handler.BoostTrain(args.id, date);
                break;
            case BOOST_TRAIN_ALL:
                canPush = handler.BoostTrainAll(date);
                break;
        }

        if (canPush) {
            this.Push();

            if ((args.type === GOLD_STORAGE || args.type === FOOD_STORAGE)
                && (args.command == COMPLETE_UPGRADE || args.command == BOOST_UPGRADE)) {
                this.RefreshStorageCap();
            }
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
            this.Handlers[type].Data = this.Data;
        }
        return this.Handlers[type];
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