// convert time (construction, train, healing...) to diamond
function ConvertTimeToDiamond(seconds){
  if (seconds <= 0)
    return 0;

  var hours = seconds / 3600.0;
  var ret = 25.18375 * Math.pow(hours, 0.7513);

  if (ret > Math.floor(ret))
    ret = ret + 1;

  return ret;
}
// convert gold/food to diamond
function ConvertGoldFoodToDiamond(quantity){
  if (quantity <= 0)
    return 0;
  var ret = Math.pow(6, Math.log(quantity) / Math.LOG10E - 2);
  if (ret <= 0)
    ret = 1;
  return ret;
}

function RefreshStorageCapacity(code){
  if (code != GOLD && code != FOOD){
    log.error("invalid resource type!")
    return -9999;
  }

  var newCap = 1000;
  var resource = new Resource(code);
  resource.SetMax(newCap);
}
