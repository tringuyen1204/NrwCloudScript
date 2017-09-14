function TechManager(playerId) {
    UserData.call(this, TECH, playerId);

    this.Execute = function (args) {
        var date = this.CheckDate(args);
        var canPush = false;

        var handler = new TechHandler(args.type);

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
            case EVOLVE:
                canPush = this.Evolve(args.id, date);
                break;
        }

        if (canPush) {
            this.Push();
        }
    };
}

TechManager.prototype = Object.create(UserData.prototype);

function TechHandler(type) {
    DataHandler.call(this, type);
}

TechHandler.prototype = Object.create(DataHandler.prototype);