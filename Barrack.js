
function BarrackHandler(type) {
    BuildingHandler.call(this, type);

    this.KillTroop = function (id, date, amount) {
        var bData = this.Get(id);

        var realDate = this.RealDate(id, date);

        if (bData.FinishTrainDate > realDate){
            bData.FinishTrainDate += amount * this.TrainTime(id);
        }
        else {
            bData.FinishTrainDate = realDate + amount * this.TrainTime(id);
        }
        this.Push();
    };
    
    this.ChangeTroop = function (id, date, troopType) {
        var bData = this.Get(id);
        if (bData.Upgrading){
            log.error("This barrack is constructing!");
        }
        var curLvData = this.CurLvlData(id);

        bData.TroopType = troopType;
        bData.FinishTrainDate = date + curLvData.TroopCapacity * this.TrainTime(id);

        this.Push();
    };

    this.TrainTime = function(id){
        return this.CurLvlData(id)[this.Get(id).TroopType + "TrainTime"];
    };

    this.BoostTrainAll = function (date) {

        var boostCost = 0;

        for(key in this.Data){
            boostCost += this.GetBoostCost(key, date);
        }

        if (boostCost > 0){
            if (SpendCurrency(DI, boostCost)) {
                for (key in this.Data) {
                    this.Get(key).FinishTrainDate = date;
                }
                this.Push();
                return true;
            }
        }
        return false;
    };

    this.BoostTrain = function (id, date) {
        var boostCost = this.GetBoostCost(id, date);
        if (boostCost > 0) {
            if (SpendCurrency(DI, boostCost)) {
                this.Get(id).FinishTrainDate = date;
                this.Push();
                return true;
            }
        }
        return false;
    };

    this.GetBoostCost = function (id, date) {
        if (!this.Get(id).Upgrading){
            var remainTime = this.Get(id).FinishTrainDate - date;
            if (remainTime > 0) {
                return ConvertTimeToDiamond(remainTime / 1000);
            }
        }
        return 0;
    };

    this.CompleteUpgrade = function(id, date) {
        var bData = this.Get(id);
        var curLvData = this.CurLvlData(id);
        bData.Level++;
        bData.Upgrading = false;
        bData.FinishTrainDate += curLvData.BuildTime;

        var kingdom = new Kingdom();
        kingdom.AddExp(this.CurLvlData(id).ExpGain);

        this.Push();
    };

    this.RealDate = function(id, date){
        if (this.Get(id).Upgrading){
            return this.Get(id).CompletedDate - this.CurLvlData(id).BuidTime;
        }
        return date;
    };

    this.GetTroopCount = function (id, date) {

        var realDate = this.RealDate(id, date);
        var bData = this.Get(id);
        var curLvData = this.CurLvlData(id);

        if (bData.FinishTrainDate < realDate) {
            return curLvData.TroopCapacity;
        }
        else {
            var remainTroop = ( bData.FinishTrainDate - realDate ) / this.TrainTime(id);
            return Math.floor(curLvData.TroopCapacity - remainTroop);
        }
    }
}
BarrackHandler.prototype = Object.create(BuildingHandler.prototype);