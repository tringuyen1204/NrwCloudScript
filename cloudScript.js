var ENERGY_CODE = "EN";					  // currecny code for our Lives VC
var COIN_CODE = "CO";					  // currency code for our Gems VC

function CheckLives(vcBalnces)
{
	if(vcBalnces != null && vcBalnces.hasOwnProperty(ENERGY_CODE) && vcBalnces[ENERGY_CODE] > 0)
	{
		return true;
	}
	else
	{
		return false;
	}
}

handlers.LevelUp = function(args){
	return GrantItem("skill.point");
}

handlers.DeleteThisAccount = function(args){
  var DeleteUsersRequest = {
    	"PlayFabIds" : [currentPlayerId],
     	"TitleId" : "EE0A"
    };

    var result = server.DeleteUsers(DeleteUsersRequest);

 	return JSON.stringify(result);
}

function GrantItem(itemId)
{
 	var GrantItemsToUserRequest = {
      "PlayFabId" : currentPlayerId,
      "ItemIds" : [itemId]
    };

    var result = server.GrantItemsToUser(GrantItemsToUserRequest);

  	return JSON.stringify(result);
}


function AddVc(vcBalnces, code, qty)
{
	if(vcBalnces != null && vcBalnces.hasOwnProperty(code) &&  vcBalnces[code] > 0)
	{
		vcBalnces[code] += qty;
	}

	var AddUserVirtualCurrencyRequest = {
	    "PlayFabId" : currentPlayerId,
	    "VirtualCurrency": code,
	    "Amount": qty
    };
    var AddUserVirtualCurrencyResult = server.AddUserVirtualCurrency(AddUserVirtualCurrencyRequest);
}

function SubtractVc(vcBalnces, code, qty)
{
	if(vcBalnces != null && vcBalnces.hasOwnProperty(code) &&  vcBalnces[code] > 0)
	{
		vcBalnces[code] -= qty;
	}

	var SubtractUserVirtualCurrencyRequest = {
	    "PlayFabId" : currentPlayerId,
	    "VirtualCurrency": code,
	    "Amount": qty
    };

    var SubtractUserVirtualCurrencyResult = server.SubtractUserVirtualCurrency(SubtractUserVirtualCurrencyRequest);
}
