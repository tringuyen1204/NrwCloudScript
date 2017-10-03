function UpgradeHandler(playerId, keys) {
    DefaultHandler.call(this, playerId, keys);

    this.Run = function (args) {
        var result = false;
        switch (args.command) {
            case CMD.UPGRADE.BASE:
                result = this.Upgrade(args);
                break;
            case CMD.UPGRADE.COMPLETE:
                result = this.CompleteUpgrade(args);
                break;
            case CMD.UPGRADE.INSTANT:
                result = this.InstantUpgrade(args);
                break;
            case CMD.UPGRADE.BOOST:
                result = this.BoostUpgrade(args);
                break;
        }

        if (result) {
            this.Push();
        }
        return result;
    };

    this.CurLvlData = function (id) {
        return MasterData.FromId(id)[String(this.Get(id).Lvl)];
    };

    this.NxtLvlData = function (id) {
        return MasterData.FromId(id)[String(this.Get(id).Lvl + 1)];
    };

    this.DefaultData = function (args) {
        return {
            "Lvl": 0
        }
    };

    this.InstantUpgrade = function (args) {
        var id = args.id;

        var nxtLv = this.NxtLvlData(id);

        var missRes = 0;

        if ("GoldCost" in nxtLv) {
            missRes += nxtLv.GoldCost;
        }

        if ("FoodCost" in nxtLv) {
            missRes += nxtLv.FoodCost;
        }

        var cost = Converter.GoldFoodToDiamond(missRes) + Converter.TimeToDiamond(nxtLv.UpTime);
        cost = Math.floor(cost * 0.9);

        var resMan = new ResHandler();

        if (Currency.Spend(DIAMOND, cost)) {
            this.Get(id).IsUp = true;
            this.CompleteUpgrade(args);
        }
    };

    this.Upgrade = function (args) {

        var id = args.id;
        var date = args.date;

        if (this.Get(id) === null) {
            var objClass = this.GetClass(id);
            this.Data[objClass][id] = this.DefaultData(args);
        }

        if (!this.CanUpgrade(id, date)) {
            return false;
        }

        var nxtLv = this.NxtLvlData(id);

        var missRes = 0;
        var needGold = false;
        var needFood = false;

        var resMan = new ResHandler();

        var data = this.Get(id);

        if ("GoldCost" in nxtLv) {
            if (resMan.ValueOf(RES.GOLD) < nxtLv.GoldCost) {
                missRes += nxtLv.GoldCost - resMan.ValueOf(RES.GOLD);
                needGold = true;
            }
        }

        if ("FoodCost" in nxtLv) {
            if (resMan.ValueOf(RES.FOOD) < nxtLv.FoodCost) {
                missRes += nxtLv.FoodCost - resMan.ValueOf(RES.FOOD);
                needFood = true;
            }
        }

        var cost = 0;

        if (missRes > 0) {
            cost = Converter.GoldFoodToDiamond(missRes);
            log.info("diamond needed = " + cost);
        }

        if ((cost === 0)
            || (cost > 0 && Currency.Spend(DIAMOND, cost) )) {
            if (needGold) {
                resMan.Change(RES.GOLD, -resMan.ValueOf(RES.GOLD));
            }
            else if ("GoldCost" in nxtLv) {
                resMan.Change(RES.GOLD, -nxtLv.GoldCost);
            }

            if (needFood) {
                resMan.Change(RES.FOOD, -resMan.ValueOf(RES.FOOD));
            }
            else if ("FoodCost" in nxtLv) {
                resMan.Change(RES.FOOD, -nxtLv.FoodCost);
            }

            data.FinishDate = date + nxtLv.UpTime;
            this.AddWorker(id);
        }
        else {
            return false;
        }

        return true;
    };

    this.CompleteUpgrade = function (args) {

        var id = args.id;
        var data = this.Get(id);

        if ("FinishDate" in data) {
            data.Lvl++;
            delete data.FinishDate;

            var kingdom = new Player();
            kingdom.AddExp(this.CurLvlData(id).Exp);
            this.RemoveWorker(id);
        }
    };

    /**
     *
     * @param {string} id
     * @param {number} date
     * @returns {boolean}
     * @constructor
     */
    this.CanUpgrade = function (id, date) {

        if (this.CheckWorking(id)) {
            log.error("Max worker reaches");
            return false;
        }
        else if (this.Upgrading(id, date)) {
            log.error("IsUp in progress");
            return false;
        }
        return true;
    };

    /**
     *
     * @param id
     * @param date
     * @returns {boolean}
     * @constructor
     */
    this.Upgrading = function (id, date) {
        var data = this.Get(id);
        if (data !== null && "FinishDate" in data) {
            return this.Get(id).FinishDate > date;
        }
        return false;
    };

    /**
     *
     * @param args
     * @returns {boolean}
     * @constructor
     */
    this.BoostUpgrade = function (args) {
        var id = args.id;
        var date = args.date;

        if (this.Completed(id, date)) {
            log.error("this building has been completed!");
        } else {

            var remainTime = ( this.Get(id).FinishDate - date );
            var diamondNeed = Converter.TimeToDiamond(remainTime);

            if (Currency.Spend(DIAMOND, diamondNeed)) {
                return this.CompleteUpgrade(id, date);
            }
        }
        return false;
    };

    /**
     *
     * @param {string} id
     * @param {number} date
     * @returns {boolean}
     * @constructor
     */
    this.Completed = function (id, date) {
        if ("FinishDate" in this.Get(id)) {
            return this.Get(id).FinishDate <= date;
        }
        return false;
    };

    this.CheckWorking = function (id) {
        var objClass = HandlerPool.GetClass(id);
        if (!("Workers" in this.Data[objClass])) {
            return false;
        }
        return this.Data[objClass]["Workers"].length >= 1;
    };

    this.AddWorker = function (id) {
        var objClass = HandlerPool.GetClass(id);
        if (!("Workers" in this.Data[objClass])) {
            this.Data[objClass]["Workers"] = [];
            this.Data[objClass]["Workers"].push(id);
        }
    };

    this.RemoveWorker = function (id) {
        var objClass = HandlerPool.GetClass(id);

        if (!("Workers" in this.Data[objClass])) {
            return;
        }

        var workers = this.Data[objClass]["Workers"];

        var index = -1;
        for (var a = 0; a < workers.length; a++) {
            if (workers[a] === id) {
                index = a;
                break;
            }
        }
        if (index !== -1) {
            workers.splice(index, 1);
        }
    };
}
