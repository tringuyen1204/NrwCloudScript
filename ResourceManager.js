function ResHandler(){
  UserData.call(this, "Resource");

  this.ValueOf = function(code){
    if (this.Data[code] == null){
        this.Data[code] = {
            "Value":0,
            "Max":0
        }
    }
    return this.Data[code].Value;
  };

  this.MaxOf = function(code){
    if (this.Data[code] == null){
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
  }
}

ResHandler.prototype = Object.create(UserData.prototype);
ResHandler.prototype.constructor = UserData;
