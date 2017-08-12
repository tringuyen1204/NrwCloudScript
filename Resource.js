function Resource(code){
  UserData.call(this, code);

  // default Value
  if (this.Data.Value == null){
    this.Data.Value = 0;
  }
  // default Value
  if (this.Data.Max = null){
    this.Data.Max = 1000;
  }

  this.Value = function(){
    return this.Data.Value;
  }

  this.Max = function(){
    return this.Data.Max;
  }

  this.Change = function(quanity){
    if (this.Data.Value + quanity < 0) {
      this.Data.Value = 0;
    }
    else if (this.Data.Value + quanity > this.Data.Max){
      this.Data.Value = this.Data.Max;
    }
    else {
      this.Data.Value += quanity;
    }

    this.Push();
  };

  this.SetMax = function(newCap){
    this.Data.Max = newCap;
    this.Push();
  };
}

Resource.prototype = Object.create(UserData.prototype);
Resource.prototype.constructor = UserData;
