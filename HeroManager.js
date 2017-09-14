function HeroManager(playerId) {
    UserData.call(this, HERO, playerId);

    this.Execute = function (args) {

        var date = this.CheckDate(args);
        var canPush = false;

        var handler = new HeroHandler(args.type);

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

HeroManager.prototype = Object.create(UserData.prototype);

function HeroHandler(type) {
    DataHandler.call(this, type);

    this.Evolve = function (id, date) {
        return true;
    };
}

HeroHandler.prototype = Object.create(DataHandler.prototype);