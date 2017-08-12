// convert time (construction, train, healing...) to diamond
function Converter(){
  this.TimeToDiamond = function(seconds){
    if (seconds <= 0)
      return 0;

    var hours = seconds / 3600.0;
    var ret = 25.18375 * Math.pow(hours, 0.7513);

    if (ret > Math.floor(ret))
      ret = ret + 1;

    return ret;
  }

  this.ResourcesToDiamond = function(resoures){
    if (resources <= 0)
      return 0;

    var ret = Math.pow(6, Math.log(resources) / Math.LOG10E - 2);

    if (ret <= 0)
      ret = 1;

    return ret;
  }
}

function RefreshStorageCapacity(code){
  if (code == GOLD || code == FOOD){
  }

  var newCap = 1000;

  var resource = new Resource(code);
  resource.SetCapacity(newCap);
}

function Resource(code){
  var resoureList = [GOLD, FOOD, FUR, SILK, ARTIFACT, JADE, PEARL];

  if (resoureList.indexOf(code) == -1){
    server.error("invalid resource!");
    return -9999;
  }
  else {
    var rawData = PfHelper.GetUserReadOnlyData([code]);
    var data = JSON.parse(rawData);

    this.value = data.value;
    this.max = data.max;
  }

  this.Change = function(quantity){
    if (this.value + quantity < 0) {
      this.value = 0;
    }
    else if (this.value + quantity > this.max){
      this.value = this.max;
    }
    PfHelper.UpdateUserReadOnlyData(data);
    return this.value;
  };

  this.SetCapacity = function(newCap){
    this.max = newCap;
    PfHelper.UpdateUserReadOnlyData(data);
    return this.max;
  };
}
