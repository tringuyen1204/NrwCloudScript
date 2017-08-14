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

  this.ChangeValue = function(code, quanity){
    if (this.Value(code) + quanity < 0) {
      this.Data[code].Value = 0;
    }
    else if (this.Value(code) + quanity > this.Max() ) {
      this.Data[code].Value = this.Max();
    }
    else {
      this.Data[code].Value += quanity;
    }
  }

  this.SetMax = function(newCap){
    this.Data.Max = newCap;
    this.Push();
  }
}

ResourceManager.prototype = Object.create(UserData.prototype);
ResourceManager.prototype.constructor = UserData;
