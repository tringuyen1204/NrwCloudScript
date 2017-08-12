function RefreshStorageCapacity(code){
  if (code != GOLD && code != FOOD){
    server.error("invalid resource type!")
    return -9999;
  }

  var newCap = 1000;
  var resource = new Resource(code);
  resource.SetMax(newCap);
}

function Resource(code){
  this.key = code;

  this.data = GetUserData(this.key);
  if (this.data == null) {
    this.data = {
      "value": 0,
      "max" : 100
    }
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

    UpdateUserData(this);
  };

  this.SetMax = function(newCap){
    this.data.max = newCap;
    UpdateUserData(this);
  };
}
