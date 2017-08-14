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

  this.Max = function(){
    if (this.Data[code] == null){
         this.Data[code] = {
            "Value":0,
            "Max":0
        }
        
    }
    return this.Data[code].Max;
  }

  this.ChangeValue = function(code, quanity){
    if (this.Data.Value + quanity < 0) {
      this.Data.Value = 0;
    }
    else if (this.Data.Value + quanity > this.Data.Max){
      this.Data.Value = this.Data.Max;
    }
    else {
      this.Data.Value += quanity;
    }
  }

  this.SetMax = function(newCap){
    this.Data.Max = newCap;
    this.Push();
  }
}

ResourceManager.prototype = Object.create(UserData.prototype);
ResourceManager.prototype.constructor = UserData;
