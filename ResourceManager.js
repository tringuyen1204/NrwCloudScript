function ResourceManager(){
  UserData.call(this, "Resource");

  this.ValueOf = function(code){
    if (this.Data[code] == null){
        this.Data[code] = {
            "Value":0,
            "Max":0
        }
    }
    return this.Data[code].Value;
  }

  this.MaxOf = function(code){
    if (this.Data[code] == null){
         this.Data[code] = {
            "Value":0,
            "Max":0
        }
    }
    return this.Data[code].Max;
  }

  this.ChangeValue = function(code, qty){
    if (this.ValueOf(code) + qty < 0) {
      this.Data[code].Value = 0;
    }
    else if (this.ValueOf(code) + qty > this.MaxOf(code) ) {
      this.Data[code].Value = this.MaxOf(code);
    }
    else {
      this.Data[code].Value += qty;
    }
  }

  this.SetMax = function(newCap){
    this.Data[code].Max = newCap;
    this.Push();
  }
}

ResourceManager.prototype = Object.create(UserData.prototype);
ResourceManager.prototype.constructor = UserData;
