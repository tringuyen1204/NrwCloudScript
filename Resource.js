function RefreshStorageCapacity(code){
  if (code != GOLD && code != FOOD){
    server.error("invalid resource type!")
    return -9999;
  }

  var newCap = 1000;
  var resource = new Resource(code);
  resource.SetMax(newCap);
}

function Resource(key){

  this.id = key;

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

  this.Change = function(value){
    if (this.data.value + value < 0) {
      this.data.value = 0;
    }
    else if (this.data + value > this.data.max){
      this.data = this.data.max;
    }
    UpdateUserData(this);
  };

  this.SetMax = function(newCap){
    this.data.max = newCap;
    UpdateUserData(this);
  };
}
