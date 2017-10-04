function BuildHandler(pId) {
    // base class
    UpgradeHandler.call(this, pId, [BUILDING]);
    this.base = new UpgradeHandler(pId);

    this.DefaultData = function (args) {
        return {
            "Lvl": 0,
            "Pos": args.position
        }
    };

    /**
     *
     * @param args
     * @returns {boolean}
     * @constructor
     */
    this.CompleteUpgrade = function (args) {
        var result = this.base.CompleteUpgrade.call(this, args);
        if (result) {
            var type = this.GetType(args.id);
            if (type === GOLD_STORAGE) {
                this.RefreshStorage(RES.GOLD);
            }
            else if (type === FOOD_STORAGE) {
                this.RefreshStorage(RES.FOOD);
            }
            return true;
        }
        return false;
    };

    /**
     *
     * @param code
     * @constructor
     */
    this.RefreshStorage = function (code) {

        var bType = code === RES.GOLD ? GOLD_STORAGE : FOOD_STORAGE;
        var keyData = code === RES.GOLD ? GOLD_CAP : FOOD_CAP;

        var newMax = 2000;
        var idSample = BUILDING + "." + bType + ".";

        for (var a = 0; a < 4; a++) {
            if (this.Get(idSample + a) !== null) {
                newMax += this.CurLvlData(idSample + a)[keyData];
            }
        }

        var resMan = new ResHandler();
        resMan.SetMax(code, newMax);
    };

    //
    // /**
    //  *
    //  * @param args
    //  * @constructor
    //  */
    // this.ApplyRaid = function (args) {
    //     args = this.FormatArgs(args);
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
