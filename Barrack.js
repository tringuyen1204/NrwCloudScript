function Barrack(type) {    Building.call(this, type);    this.KillTroop = function (id, date, amount) {        var bData = this.Get(id);        var realDate = this.RealDate(id, date);        if (bData.FinishTrainDate > realDate) {            bData.FinishTrainDate += amount * this.TrainTime(id);        }        else {            bData.FinishTrainDate = realDate + amount * this.TrainTime(id);        }        this.Push();    };    this.ChangeTroop = function (id, date, troopType) {        var bData = this.Get(id);        if (bData.Upgrading) {            log.error("This barrack is constructing!");        }        var curLvData = this.CurLvlData(id);        bData.TroopType = troopType;        var totalTroop = Math.floor(curLvData.TroopCapacity / this.TroopSize(id));        bData.FinishTrainDate = date + totalTroop * this.TrainTime(id);        this.Push();    };    /**     * @return {number}     */    this.TrainTime = function (id) {        var key;        switch (this.Get(id).TroopType) {            case INF:                key = "InfantryTrainTime";                break;            case SKR:                key = "SkirmisherTrainTime";                break;            case CAV:                key = "CavalryTrainTime";                break;        }        return this.CurLvlData(id)[key];    };    /**     * @return {number}     */    this.TroopSize = function (id) {        if (this.Get(id).TroopType == CAV) {            return 2;        }        return 1;    };    this.BoostTrainAll = function (date) {        var boostCost = 0;        for (key in this.Data) {            boostCost += this.GetBoostCost(key, date);        }        if (boostCost > 0 && SpendCurrency(DIAMOND, boostCost)) {            for (key in this.Data) {                this.Get(key).FinishTrainDate = date;            }            this.Push();            return true;        }        return false;    };    this.BoostTrain = function (id, date) {        var boostCost = this.GetBoostCost(id, date);        if (boostCost > 0 && SpendCurrency(DIAMOND, boostCost)) {            this.Get(id).FinishTrainDate = date;            this.Push();            return true;        }        return false;    };    this.GetBoostCost = function (id, date) {        if (!this.Get(id).Upgrading) {            var remainTime = this.Get(id).FinishTrainDate - date;            if (remainTime > 0) {                return ConvertTimeToDiamond(remainTime);            }        }        return 0;    };    this.DefaultData = function (date, position) {        return {            "Level": 0,            "Upgrading": false,            "CompletedDate": 0,            "Position": position,            "FinishTrainDate": date,            "TroopType": "Infantry"        }    };    this.CompleteUpgrade = function (id, date) {        var bData = this.Get(id);        bData.Level++;        bData.Upgrading = false;        var curLvData = this.CurLvlData(id);        if (bData.Level > 1) {            bData.FinishTrainDate += curLvData.BuildTime;        }        var kingdom = new Kingdom();        kingdom.AddExp(curLvData.ExpGain);        this.Push();    };    /**     * @return {number}     */    this.RealDate = function (id, date) {        if (this.Get(id).Upgrading) {            return this.Get(id).CompletedDate - this.NxtLvlData(id).BuidTime;        }        return date;    };    /**     * @return {number}     */    this.TroopCount = function (id, date) {        var realDate = this.RealDate(id, date);        var bData = this.Get(id);        var curLvData = this.CurLvlData(id);        var totalTroop = Math.floor(curLvData.TroopCapacity / this.TroopSize(id));        if (bData.FinishTrainDate < realDate) {            return totalTroop;        }        else {            var remainTroop = ( bData.FinishTrainDate - realDate ) / this.TrainTime(id);            return Math.floor(totalTroop - remainTroop);        }    }}Barrack.prototype = Object.create(Building.prototype);