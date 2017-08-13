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
function RefreshStorageCap(code){
  if (code != GOLD && code != FOOD){
    log.error("invalid resource type!")
    return -9999;
  }

  var newCapacity = 0;

  if (code == GOLD){
    var allStorages = GetMultipleUserData([
      "Castle0",
      GOLD_STORAGE+0,
      GOLD_STORAGE+1,
      GOLD_STORAGE+2,
      GOLD_STORAGE+3
    ]);
  }
  else {
    var allStorages = GetMultipleUserData([
      "Castle0",
      FOOD_STORAGE+0,
      FOOD_STORAGE+1,
      FOOD_STORAGE+2,
      FOOD_STORAGE+3
    ]);
  }

  for (var storage in allStorages) {
    newCapacity += allStorages[storage].Data.MasterData[code + "Capacity"];
  }

  var resource = new Resource(code);
  resource.SetMax(newCapacity);
}

function TryUsingCurrency(code, qty){
  var vcBalances = server.GetUserInventory({
    "PlayFabId": currentPlayerId
  }).VirtualCurrency;

  if (vcBalances != null
    && vcBalances.hasOwnProperty(code)
    && vcBalances[code] >= qty){
      ChangeCurrency(vcBalances, code, qty);
      return true;
    }
    return false;
}

function ChangeCurrency(vcBalances, code, qty)
{
	if(vcBalances != null
    && vcBalances.hasOwnProperty(code)
    && (vcBalances[code] + qty >= 0) )
	{
		vcBalances[code] += qty;
	}

  if (qty > 0){
    server.AddUserVirtualCurrency({
      "PlayFabId" : currentPlayerId,
      "VirtualCurrency": code,
      "Amount": Math.abs(qty)
    });
  }
  else {
    server.SubtractUserVirtualCurrency({
      "PlayFabId" : currentPlayerId,
      "VirtualCurrency": code,
      "Amount": Math.abs(qty)
    });
  }
}
