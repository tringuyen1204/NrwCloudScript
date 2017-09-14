function HeroManager(playerId) {
    DataManager.call(this, HERO, playerId);

    this.GetHandler = function (args) {
        var handlers = this.Handlers;
        var type = args.type;

        if (handlers.hasOwnProperty(type)) {
            handlers[type] = new HeroHandler(type);
            handlers[type].Data = this.Data;
        }
        return handlers[type];
    }
}

HeroManager.prototype = Object.create(DataManager.prototype);

function HeroHandler(type) {
    DataHandler.call(this, type);

    this.Evolve = function (id, date) {
        var heroData = this.Get(id);
        var shardsReqList = Constant.Get("HeroShardLimit");

        if (heroData.Star >= shardsReqList.length + 1) {
            return false;
        }

        var shardReq = shardsReqList[heroData.Star - 1];

        if (heroData.Shards >= shardReq) {
            heroData.Shards -= shardReq;
            heroData.Star = heroData.Star + 1;
            return true;
        }
        return false;
    };
}

HeroHandler.prototype = Object.create(DataHandler.prototype);