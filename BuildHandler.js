function BuildHandler(playerId) {
    // base class
    UpgradeHandler.call(this, playerId, [BUILDING]);
    this.base = new UpgradeHandler(playerId);

    this.DefaultData = function (args) {
        return {
            "Lvl": 0,
            "Pos": args.position
        }
    };

    this.CompleteUpgrade = function (args) {
        this.base.CompleteUpgrade.call(this, args);
        var type = this.GetType(args.id);
        if (type === GOLD_STORAGE) {
            this.RefreshStorage(RES.GOLD);
        }
        else if (type === FOOD_STORAGE) {
            this.RefreshStorage(RES.FOOD);
        }
    };

    this.RefreshStorage = function (code) {

        var bType = code === RES.GOLD ? GOLD_STORAGE : FOOD_STORAGE;
        var keyData = code === RES.GOLD ? "GoldCap" : "FoodCap";

        var newMax = 0;
        var key = "Castle" + code + "Storage";

        newMax += TitleData.GetConst(key);

        var bData = this.Data[BUILDING];
        var idSample = BUILDING + "." + bType + ".";

        for (var a = 0; a < 4; a++) {
            newMax += this.CurLvlData(idSample + a)[keyData];
        }

        var resMan = new ResHandler();
        resMan.SetMax(code, newMax);
    };

    // /**
    //  *
    //  * @param args
    //  * @returns {{ProducedGold: number, ProducedFood: number}}
    //  * @constructor
    //  */
    // this.ProducedResource = function (args) {
    //     args = this.FormatData(args);
    //     var pGold = this.HandlerByType(MARKET).AllResource(args.date) * 0.5;
    //     var pFood = this.HandlerByType(FARM).AllResource(args.date) * 0.5;
    //
    //     return {
    //         ProducedGold: Math.floor(pGold),
    //         ProducedFood: Math.floor(pFood)
    //     }
    // };
    //
    // /**
    //  *
    //  * @param args
    //  * @returns {{}}
    //  * @constructor
    //  */
    // this.GetTroopInfo = function (args) {
    //     args = this.FormatData(args);
    //     return this.GetHandler(BARRACK).GetTroopInfo(args);
    // };
    //
    // /**
    //  *
    //  * @param args
    //  * @constructor
    //  */
    // this.ApplyRaid = function (args) {
    //     args = this.FormatData(args);
    //     this.GetHandler(MARKET).ApplyRaid(args.date, args.rate);
    //     this.GetHandler(FARM).ApplyRaid(args.date, args.rate);
    //     this.PushNow();
    // };
    //
    // /**
    //  *
    //  * @param code
    //  * @constructor
    //  */

}

BuildHandler.prototype = Object.create(UpgradeHandler.prototype);
