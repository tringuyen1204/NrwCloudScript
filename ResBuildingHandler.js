
function ResBuildHandler(type){
    BuildingHandler.call(this, type);

    this.CompleteUpgrade = function(id, date) {
        log.info("complete resource building");
        var bData = this.Get(id);
        bData.Level++;
        bData.Upgrading = false;
        bData.LastCollectDate = date;

        var kingdom = new Kingdom();
        kingdom.AddExp(this.CurLvlData(id).ExpGain);

        this.Push();
    };

    this.DefaultData = function (date, position) {
        return {
            "Level":0,
            "Upgrading":false,
            "CompletedDate":0,
            "LastCollectDate":date,
            "Position":position
        }
    };

    this.Upgrade = function (id, date) {
        this.TryCollect(id, date);

        if (this.Get(id) == null){
            log.error("Error: " + this.Type + id + " doesn't exist!");
            return false;
        }

        if ( this.TryUpgrade(id, date) ){
            this.Push();
            return true;
        }
        return false;

    };

    this.Collect = function(id, date){
        if (this.TryCollect(id, date) ){
            this.Push();
        }
    };

    this.CollectAll = function(date){
        for (var id in this.Data){
            this.TryCollect(id, date);
        }
        this.Push();
    };

    this.TryCollect = function(id, date){

        var bData = this.Get(id);

        if (bData == null || bData.Level == 0 || bData.Upgrading) {
            return false;
        }

        var code = (this.Type == MARKET) ? GOLD : FOOD;

        var produceRate = this.CurLvlData(id).ProduceRate;
        var workingTime = ( date - bData.LastCollectDate ) / ONE_HOUR ;

        var amount = Math.floor( workingTime * produceRate );
        var capacity = this.CurLvlData(id)[code+"Capacity"]; // GoldCapacity or FoodCapacity

        if (amount > capacity){
            amount = capacity;    // product amount can't surpass capacity
        }

        if (amount > 0){

            var resMan = new ResHandler();

            var curRes = resMan.ValueOf(code);
            var curMax = resMan.MaxOf(code);

            if (amount + curRes > curMax){
                resMan.Change(code, curMax - curRes);
                amount -= curMax - curRes;
            }
            else {
                resMan.Change(code, amount);
                amount = 0;
            }

            bData.LastCollectDate = Math.floor(date - (amount / produceRate) * ONE_HOUR);
            resMan.Push();

            return true;
        }
        else {
            return false;
        }
    };
}

ResBuildHandler.prototype = Object.create(BuildingHandler.prototype);