// "gold", "food", "fur", "silk"
function ChangeCurrency(code, qty)
{
	var AddUserVirtualCurrencyRequest = {
	    "PlayFabId" : currentPlayerId,
	    "VirtualCurrency": code,
	    "Amount": qty
    };
  var AddUserVirtualCurrencyResult = server.AddUserVirtualCurrency(AddUserVirtualCurrencyRequest);
}

