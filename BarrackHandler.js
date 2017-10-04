function BarrackHandler(pId) {
    BuildHandler.call(this, pId);
    this.base = new BuildHandler();

    /**
     *
     * @param id
     * @param date
     * @param qty
     * @returns {boolean}
     * @constructor
     */
    this.KillTroop = function (id, date, qty) {
        var bData = this.Get(id);
        var realDate = this.RealDate(id, date);

        if (bData.FinishTrainDate > realDate) {
            bData.FinishTrainDate += Math.floor(qty) * this.TrainTime(id);
        }
        else {
            bData.FinishTrainDate = realDate + Math.floor(qty) * this.TrainTime(id);
        }
        return true;
    };

    /**
     *
     * @param args
     * @returns {boolean}
     * @constructor
     */
    this.ApplyCasualties = function (args) {
        var date = args.date;

        var casualtiesData = args.Casualties;

        for (var k in casualtiesData) {
            var troopClass = TroopNameToClass(k);

            if (troopClass === null) {
                continue;
            }

            var qty = casualtiesData[k]["Qty"];
            var ids = this.IdsByClass(troopClass);
            var totalTroop = 0;
            var a;
            var troopQty = {};
            var remainCas = qty;
            var count = 0;
            // cache total troop
            for (a = 0; a < ids.length; a++) {
                count = this.TroopCount(ids[a], date);
                troopQty[ids[a]] = count;
                totalTroop += count;
            }

            var cas = 0;
            // kill troops
            for (a = 0; a < ids.length; a++) {
                if (a !== ids.length - 1 || a === 0) {
                    cas = Math.floor(troopQty[ids[a]] / totalTroop * qty);
                    remainCas -= cas;
                }
                else {
                    cas = Math.floor(remainCas);
                }
                this.KillTroop(ids[a], date, cas);
            }
        }
        return true;
    };

    /**
     *
     * @param troopClass
     * @returns {Array}
     * @constructor
     */
    this.IdsByClass = function (troopClass) {

        var list = [];

        for (var k in this.Data[BARRACK]) {
            if (this.Get(k).Class === troopClass) {
                list.push(k);
            }
        }
        return list;
    };

    /**
     *
     * @param args
     * @returns {newdata}
     * @constructor
     */
    this.Run = function (args) {
        var result = this.base.Run.call(this, args);
        if (!result) {
            switch (args.command) {
                case CMD.BARRACK.CHANGE_TROOP:
                    result = this.ChangeTroop(args);
                    break;
                case CMD.BARRACK.BOOST_TRAIN:
                    result = this.BoostTrain(args);
                    break;
                case CMD.BARRACK.BOOST_ALL:
                    result = this.BoostTrainAll(args);
                    break;
            }
            if (result) {
                this.Push();
            }
        }
        return result;
    };

    /**
     *
     * @param args
     * @returns {boolean}
     * @constructor
     */
    this.ChangeTroop = function (args) {
        var id = args.id;
        var date = args.date;
        var troopClass = args.troopClass;

        var bData = this.Get(id);
        if (bData.IsUp) {
            log.error("This barrack is constructing!");
            return false;
        }
        var curLvData = this.CurLvlData(id);

        bData.Class = troopClass;
        var totalTroop = Math.floor(curLvData.TroopCap / this.TroopSize(id));

        bData.FinishTrainDate = date + totalTroop * this.TrainTime(id);

        return true;
    };

    /**
     * @return {number}
     * @param id
     * @constructor
     */
    this.TrainTime = function (id) {
        var k;
        switch (this.Get(id).Class) {
            case INF:
                k = "TrainTimeINF";
                break;
            case SKR:
                k = "TrainTimeSKR";
                break;
            case CAV:
                k = "TrainTimeCAV";
                break;
        }
        return this.CurLvlData(id)[k];
    };

    /**
     *
     * @param id
     * @returns {number}
     * @constructor
     */
    this.TroopSize = function (id) {
        if (this.Get(id).Class === CAV) {
            return 2;
        }
        return 1;
    };

    /**
     *
     * @param args
     * @returns {boolean}
     * @constructor
     */
    this.BoostTrainAll = function (args) {

        var date = args.date;

        var boostCost = 0;
        var k;
        for (k in this.Data) {
            boostCost += this.GetBoostCost(k, date);
        }

        if (boostCost > 0 && Currency.Spend(DIAMOND, boostCost)) {
            for (k in this.Data) {
                this.Get(k).FinishTrainDate = date;
            }
            return true;
        }
        return false;
    };

    /**
     *
     * @param args
     * @returns {boolean}
     * @constructor
     */
    this.BoostTrain = function (args) {

        var id = args.id;
        var date = args.date;

        var boostCost = this.GetBoostCost(id, date);
        if (boostCost > 0 && Currency.Spend(DIAMOND, boostCost)) {
            this.Get(id).FinishTrainDate = date;
            return true;
        }
        return false;
    };

    /**
     *
     * @param id
     * @param date
     * @returns {number}
     * @constructor
     */
    this.GetBoostCost = function (id, date) {
        if (!this.Get(id).IsUp) {
            var remainTime = this.Get(id).FinishTrainDate - date;
            if (remainTime > 0) {
                return Converter.TimeToDiamond(remainTime);
            }
        }
        return 0;
    };

    /**
     *
     * @param args
     * @returns {{}}
     * @constructor
     */
    this.DefaultData = function (args) {
        return {
            "Lvl": 0,
            "Pos": args.position,
            "FinishTrainDate": args.date,
            "Class": INF
        }
    };

    /**
     *
     * @param args
     * @returns {boolean}
     * @constructor
     */
    this.CompleteUpgrade = function (args) {

        if (this.base.CompleteUpgrade.call(this, args)) {
            var id = args.id;
            var date = args.date;
            var bData = this.Get(id);
            var curLvData = this.CurLvlData(id);
            if (bData.Lvl > 1) {
                bData.FinishTrainDate += date - (bData.FinishDate - curLvData.UpTime);
            }
            return true;
        }
        return false;
    };

    /**
     *
     * @param id
     * @param date
     * @returns {number}
     * @constructor
     */
    this.RealDate = function (id, date) {
        if (this.Upgrading(id, date)) {
            return this.Get(id).FinishDate - this.NxtLvlData(id).UpTime;
        }
        return date;
    };

    /**
     *
     * @param id
     * @param date
     * @returns {number}
     * @constructor
     */
    this.TroopCount = function (id, date) {
        var realDate = this.RealDate(id, date);
        var bData = this.Get(id);
        var curLvData = this.CurLvlData(id);

        var totalTroop = Math.floor(curLvData.TroopCapacity / this.TroopSize(id));

        if (bData.FinishTrainDate < realDate) {
            return totalTroop;
        }
        else {
            var remainTroop = ( bData.FinishTrainDate - realDate ) / this.TrainTime(id);
            return Math.floor(totalTroop - remainTroop);
        }
    };

    /**
     *
     * @param args
     * @returns {{}}
     * @constructor
     */
    this.GetTroopInfo = function (args) {
        var k;
        var data;

        var ret = {};

        for (k in this.Data[BARRACK]) {
            data = this.Get(k);

            var troopName = TROOP_MATCH_HASH[data.Class];

            if (!(troopName in ret)) {
                ret[troopName] = {
                    Lvl: 1,
                    Qty: 0
                };
            }
            ret[troopName].Qty += this.TroopCount(k, args.date);
        }
        return ret;
    };
}
BarrackHandler.prototype = Object.create(BuildHandler.prototype);