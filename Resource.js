function Resource(code){
  UserData.call(this, code);

  // default value
  if (this.data.value == null){
    this.data.value = 0;
  }

  // default value
  if (this.data.max = null){
    this.data.max = 100;
  }
  
  this.Value = function(){
    return this.data.value;
  }

  this.Max = function(){
    return this.data.max;
  }

  this.Change = function(quanity){
    if (this.data.value + quanity < 0) {
      this.data.value = 0;
    }
    else if (this.data.value + quanity > this.data.max){
      this.data.value = this.data.max;
    }
    else {
      this.data.value += quanity;
    }

    this.Push();
  };

  this.SetMax = function(newCap){
    this.data.max = newCap;
    this.Push();
  };
}

Resource.prototype = Object.create(UserData.prototype);
Resource.prototype.constructor = UserData;
