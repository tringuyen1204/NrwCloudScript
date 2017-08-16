function ResourceBuildingHandler(type){
    BuildingHandler.call(this, type);

    this.DefaultData = function(){
        return {
            "Level":0,
            "Upgrading":false,
            "CompletedDate":0,
            "LastCollectDate":this.ServerTime()
        }
    }

    this.Collect = function(id){
        if (this.TryCollect(id) ){
            this.Push();
        }
    }

    this.CollectAll = function(){
        for (var id in this.Data){
            this.TryCollect(id);
        }
        this. tsPush();
    }

    this.PrepareUpgrade = function(id){
        this.TryCollect(id);
    }

    this.PreCompleteUpgrade = function (id) {

        this.Get(id).Level++;
        this.Get(id).Upgrading = false;
        this.Get(id).LastCollectDate = this.ServerTime();

        var kingdom = new Kingdom();
        kingdom.AddExp(this.CurrentLevelData(id).ExpGain);

    }

    this.TryCollect = function(id){

        if (this.Data[id] == null){
            log.info("error: " + type + id + " doesn't exist!");

            return false;
        }

        var code = (type == MARKET) ? GOLD : FOOD;

        var produceRate = this.CurrentLevelData(id).ProduceRate;
        var workingTime = ( this.ServerTime() - this.Get(id).LastCollectDate ) / ONE_HOUR ;

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

            this.Get(id).LastCollectDate = Math.floor(this.ServerTime() - (amount / produceRate) * ONE_HOUR);
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
