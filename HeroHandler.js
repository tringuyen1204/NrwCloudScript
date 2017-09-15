HeroHandler = function HeroHandler(type) {
    DataHandler.call(this, type);
};

HeroHandler.prototype = Object.create(DataHandler.prototype);

HeroHandler.prototype.Evolve = function (args) {

    var id = args.id;
    var date = args.date;

    var heroData = this.GetConstant(id);
    var shardsReqList = TitleData.GetConstant("HeroEvolution");

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

HeroHandler.prototype.Execute = function (args) {
    var ret = DataHandler.prototype.Execute.call(this, args);

    if (!ret) {
        switch (args.command) {
            case CMD_EVOLVE:
                return this.Evolve(args);
        }
    }
    return ret;
};