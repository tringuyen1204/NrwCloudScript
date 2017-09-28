function CampaignManager(playerId) {
 DefaultManager.call(this, ["Campaign"], playerId);

 this.GetHandler = function (args) {
  return new BattleHandler();
 };
}

CampaignManager.prototype = Object.create(DefaultManager.prototype);
