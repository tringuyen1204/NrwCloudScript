function BattleDataManager(playerId) {
    this.Handlers = {};
    UserData.call(this, "BattleData", playerId);
}