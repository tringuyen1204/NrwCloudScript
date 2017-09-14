function TechManager(playerId) {
    UserData.call(this, TECH, playerId);

    this.Execute = function (args) {
        var date = this.CheckDate(args);
        var canPush = false;

        var handler = new ResearchHandler(args.type);
        handler.Data = this.Data[TECH];

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

TechManager.prototype = Object.create(UserData.prototype);

function ResearchHandler(type) {
    DataHandler.call(this, type);
}

ResearchHandler.prototype = Object.create(DataHandler.prototype);