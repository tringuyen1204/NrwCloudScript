function TechManager(playerId) {
    DataManager.call(this, TECH, playerId);
}

TechManager.prototype = Object.create(DataManager.prototype);