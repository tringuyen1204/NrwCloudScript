/**
 * @return(diamondCost)
 */
function ConvertTimeToDiamond(milisec) {
    if (milisec <= 0)
    return 0;

    var hours = milisec / ONE_HOUR;
  var ret = 25.18375 * Math.pow(hours, 0.7513);

  if (ret > Math.floor(ret))
    ret = ret + 1;

  return ret;
}

/**
 * @return(diamondCost)
 */
function ConvertGoldFoodToDiamond(qty) {
    if (qty <= 0)
        return 0;
    var ret = Math.pow(6, Math.log(qty / 100) / Math.log(10));
    if (ret < 1)
        ret = 1;
    return Math.floor(ret);
}

/**
 * @return(boolean)
 */
function SpendCurrency(code, qty){
    var vcBalances = server.GetUserInventory({
        "PlayFabId": currentPlayerId
    }).VirtualCurrency;

    if (vcBalances != null
        && vcBalances.hasOwnProperty(code)
        && vcBalances[code] >= qty){
        ChangeCurrency(vcBalances, code, -qty);
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