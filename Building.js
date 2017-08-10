handlers.UpgradeBuilding = function(args) {

  // get the calling player's inventory and VC balances
	var GetUserInventoryRequest = {
        "PlayFabId": currentPlayerId
    };

  var GetUserInventoryResult = server.GetUserInventory(GetUserInventoryRequest);
}

class BuildingBuilder{

  constructor(buildingId){
    this.id = buildingId;
  }

  function upgrade(){
  }
}
