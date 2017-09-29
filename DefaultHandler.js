function DefaultHandler() {

    this.Run = function (args) {
        switch (args.command) {
            case CMD_UPGRADE:
                return this.Upgrade(args);
            case CMD_COMPLETE_UPGRADE:
                return this.CompleteUpgrade(args);
            case CMD_INSTANT_UPGRADE:
                return this.InstantUpgrade(args);
            case CMD_BOOST_UPGRADE:
                return this.BoostUpgrade(args);
        }
        return false;
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

    this.GetClass = function (id) {
        var temp = id.split('.')[0];
        switch (temp) {
            case BUILDING:
                return BUILDING;
            case GENERAL:
            case ADVISOR:
                return HERO;
            case TECH:
                return TECH;
            case TROOP:
                return TROOP;
            case MERC:
                return INV;
        }
    };

    this.GetType = function (id) {
        return id.split('.')[1];
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

        var cost = Converter.GoldFoodToDiamond(resCost) + Converter.TimeToDiamond(nxtLv.UpTime);
        cost = Math.floor(cost * 0.9);

        var resMan = new ResManager();

        if (Currency.Spend(DIAMOND, cost)) {
            this.Get(id).IsUp = true;
            this.CompleteUpgrade(args);
        }
    };

    this.Upgrade = function (args) {

        var id = args.id;
        var date = args.date;

        if (this.Get(id) === null) {
            this.Data[id] = this.DefaultData(args);
        }

        if (!this.CanUpgrade(id)) {
            return false;
        }

        var nxtLv = this.NxtLvlData(id);

        var missRes = 0;
        var needGold = false;
        var needFood = false;

        var resMan = new ResManager();

        var data = this.Get(id);

        if ("GoldCost" in nxtLv) {
            if (resMan.ValueOf(GOLD) < nxtLv.GoldCost) {
                missRes += nxtLv.GoldCost - resMan.ValueOf(GOLD);
                needGold = true;
            }
        }

        if ("FoodCost" in nxtLv) {
            if (resMan.ValueOf(FOOD) < nxtLv.FoodCost) {
                missRes += nxtLv.FoodCost - resMan.ValueOf(FOOD);
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
                resMan.Change(GOLD, -resMan.ValueOf(GOLD));
            }
            else if ("GoldCost" in nxtLv) {
                resMan.Change(GOLD, -nxtLv.GoldCost);
            }

            if (needFood) {
                resMan.Change(FOOD, -resMan.ValueOf(FOOD));
            }
            else if ("FoodCost" in nxtLv) {
                resMan.Change(FOOD, -nxtLv.FoodCost);
            }

            resMan.Push();

            data.FinishDate = date + nxtLv.UpTime;
            this.AddWorkder(id);
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

    this.CanUpgrade = function (id) {

        if (this.GetWorkers().length > 1) {
            log.error("Max worker reaches");
            return false;
        }
        else if (this.Get(id).Upgrading) {
            log.error("IsUp in progress");
            return false;
        }
        return true;
    };

    this.Upgrading = function (id, date) {
        if ("FinishDate" in this.Get(id)) {
            return this.Get(id).FinishDate > date;
        }
        return false;
    };

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

    this.Completed = function (id, date) {
        if ("FinishDate" in this.Get(id)) {
            return this.Get(id).FinishDate <= date;
        }
        return false;
    };

    this.AddWorkder = function (id) {
        this.GetWorkers().push(id);
    };

    this.GetWorkers = function () {
        if (!this.Data.hasOwnProperty("Workers")) {
            this.Data.Workers = [];
        }
        return this.Data.Workers;
    };

    this.RemoveWorker = function (id) {

        var worker = this.GetWorkers();
        var index = -1;
        for (var a = 0; a < worker.length; a++) {
            if (worker[a] === id) {
                index = a;
                break;
            }
        }
        if (index !== -1) {
            worker.splice(index, 1);
        }
    };

    this.Get = function (id) {

        var objClass = this.GetClass(id);

        if (this.Data[objClass].hasOwnProperty(id)) {
            return this.Data[objClass][id];
        }
        else {
            return null;
        }
    };
}
