HeroHandler = function HeroHandler(type) {
    DataHandler.call(this, type);
};

HeroHandler.prototype = Object.create(DataHandler.prototype);

HeroHandler.prototype.Evolve = function (args) {

    var id = args.id;
    var date = args.date;

    var heroData = this.Get(id);
    var shardsReqList = TitleData.Get("HeroEvolution");

    if (heroData.Star >= shardsReqList.length) {
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

HeroHandler.prototype.Run = function (args) {
    var ret = DataHandler.prototype.Run.call(this, args);

    if (!ret) {
        switch (args.command) {
            case CMD_EVOLVE:
                return this.Evolve(args);
        }
    }
    return ret;
};