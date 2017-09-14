function HeroManager(playerId) {
    UserData.call(this, HERO, playerId);

    this.Execute = function (args) {

        var date = this.CheckDate(args);
        var canPush = false;

        switch (args.command) {
            case UPGRADE:
                canPush = this.Upgrade(args.id, date);
                break;
            case COMPLETE_UPGRADE:
                canPush = this.CompleteUpgrade(args.id, date);
                break;
            case BOOST_UPGRADE:
                canPush = this.BoostUpgrade(args.id, date);
                break;
            case EVOLVE:
                canPush = this.Evolve(args.id, date);
                break;
        }

        if (canPush) {
            this.Push();
        }
    };

    this.Upgrade = function (id, date) {
        // TODO: upgrade hero
        return false;
    };

    this.CompleteUpgrade = function (id, date) {
        // TODO: complete hero upgrade
        return false;
    };

    this.BoostUpgrade = function (id, date) {
        // TODO: boost hero upgrade with diamond
        return false;
    };

    this.Evolve = function (id, date) {
        // TODO: increase hero stars
        return false;
    };
}

HeroManager.prototype = Object.create(UserData.prototype);
