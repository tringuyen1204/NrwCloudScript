function ResourceManager(){
  UserData.call(this, "Resource");

  this.Value = function(code){
    if (this.Data[code] == null){
        this.Data[code] = {
            "Value":0,
            "Max":0
        }
    }
    return this.Data[code].Value;
  }

  this.Max = function(code){
    if (this.Data[code] == null){
         this.Data[code] = {
            "Value":0,
            "Max":0
        }
    }
    return this.Data[code].Max;
  }

  this.ChangeValue = function(code, qty){
    if (this.Value(code) + qty < 0) {
      this.Data[code].Value = 0;
    }
    else if (this.Value(code) + qty > this.Max(code) ) {
      this.Data[code].Value = this.Max(code);
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
