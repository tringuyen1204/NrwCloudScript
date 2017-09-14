function HeroManager(playerId) {
    UserData.call(this, HERO, playerId);

    this.Execute = function (args) {

        var date = this.CheckDate(args);
        var canPush = false;
        var handler = new HeroTrainer(args.type);

        switch (args.command) {
            case UPGRADE:
                canPush = handler.Upgrade("0", date);
                break;
            case COMPLETE_UPGRADE:
                canPush = handler.CompleteUpgrade("0", date);
                break;
            case BOOST_UPGRADE:
                canPush = handler.BoostUpgrade("0", date);
                break;
            case EVOLVE:
                canPush = this.Evolve("0", date);
                break;
        }

        if (canPush) {
            this.Push();
        }
    };
}

HeroManager.prototype = Object.create(UserData.prototype);

function HeroTrainer(type) {
    DataHandler.call(this, type);

    this.Evolve = function (id, date) {
        return true;
    };
}

HeroTrainer.prototype = Object.create(DataHandler.prototype);