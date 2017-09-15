HeroHandler = function HeroHandler(type) {
    DataHandler.call(this, type);
};

HeroHandler.prototype = Object.create(DataHandler.prototype);

HeroHandler.prototype.Evolve = function (args) {

    var id = args.id;
    var date = args.date;

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

HeroHandler.prototype.Execute = function (args) {
    var ret = DataHandler.prototype.Execute.call(this, args);

    if (!ret) {
        switch (args.command) {
            case EVOLVE:
                return this.Evolve(args);
        }
    }
    return ret;
};