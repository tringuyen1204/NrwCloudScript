function CampaignManager(playerId) {
 DataManager.call(this, playerId);

 this.GetHandler = function (args) {
  return new BattleHandler();
 };
}

CampaignManager.prototype = Object.create(DataManager.prototype);