CampaignManager = function (playerId) {
    DataManager.call(this, playerId);
};

CampaignManager.prototype = Object.create(DataManager.prototype);

CampaignManager.prototype.GetHandler = function (args) {
    return new BattleHandler();
};