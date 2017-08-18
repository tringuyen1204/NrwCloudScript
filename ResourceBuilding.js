function ResourceBuildingHandler(type){
    BuildingHandler.call(this, type);

    this.DefaultData = function(){
        return {
            "Level":0,
            "Upgrading":false,
            "CompletedDate":0,
            "LastCollectDate":this.ServerTime()
        }
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

    this.PrepareUpgrade = function(id, date){
        this.TryCollect(id, date);
    };

    this.PreCompleteUpgrade = function (id, date) {

        this.Get(id).Level++;
        this.Get(id).Upgrading = false;
        this.Get(id).LastCollectDate = date;

        var kingdom = new Kingdom();
        kingdom.AddExp(this.CurrentLevelData(id).ExpGain);

    };

    this.TryCollect = function(id, date){

        if (this.Data[id] == null){
            log.info("error: " + type + id + " doesn't exist!");

            return false;
        }

        var code = (type == MARKET) ? GOLD : FOOD;

        var produceRate = this.CurrentLevelData(id).ProduceRate;
        var workingTime = ( date - this.Get(id).LastCollectDate ) / ONE_HOUR ;

        var amount = Math.floor( workingTime * produceRate );
        var capacity = this.CurrentLevelData(id)[code+"Capacity"]; // GoldCapacity or FoodCapacity

        if (amount > capacity){
            amount = capacity;    // product amount can't surpass capacity
        }

        if (amount > 0){

            var resMan = new ResourceManager();

            var curRes = resMan.ValueOf(code);
            var curMax = resMan.MaxOf(code);

            if (amount + curRes > curMax){
                resMan.ChangeValue(code, curMax - curRes);
                amount -= curMax - curRes;
            }
            else {
                resMan.ChangeValue(code, amount);
                amount = 0;
            }

            this.Get(id).LastCollectDate = Math.floor(date - (amount / produceRate) * ONE_HOUR);
            resMan.Push();

            return true;
        }
        else {
            return false;
        }
    }
}

ResourceBuildingHandler.prototype = Object.create(BuildingHandler.prototype);
ResourceBuildingHandler.prototype.constructor = BuildingHandler;
