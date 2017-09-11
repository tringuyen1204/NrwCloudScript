function ResHandler(){
  UserData.call(this, "Resource");

  this.ValueOf = function(code){
      if (this.Data[code] === null) {
        this.Data[code] = {
            "Value":0,
            "Max":0
        }
    }
    return this.Data[code].Value;
  };

  this.MaxOf = function(code){
      if (this.Data[code] === null) {
         this.Data[code] = {
            "Value":0,
            "Max":0
        }
    }
    return this.Data[code].Max;
  };

  this.Change = function(code, qty){
    if (this.ValueOf(code) + qty < 0) {
      this.Data[code].Value = 0;
    }
    else if (this.ValueOf(code) + qty > this.MaxOf(code) ) {
      this.Data[code].Value = this.MaxOf(code);
    }
    else {
      this.Data[code].Value += qty;
    }
  };

  this.SetMax = function(code, newMax){
    this.Data[code].Max = newMax;
    this.Push();
  };

    this.AvailableResource = function (date) {
        var resInfo = {};

        var goldHandler = CreateHandler(MARKET);
        resInfo[GOLD] = 0.25 * this.Data[GOLD].Value;
        resInfo[GOLD] += 0.5 * goldHandler.AllResource(date);

        var foodHandler = CreateHandler(FARM);
        resInfo[FOOD] = 0.25 * this.Data[FOOD].Value;
        resInfo[FOOD] += 0.5 * foodHandler.AllResource(date);

        return resInfo;
    };
}

ResHandler.prototype = Object.create(UserData.prototype);