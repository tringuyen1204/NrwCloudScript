function TechManager(playerId) {
    UserDataManager.call(this, TECH, playerId);
}

TechManager.prototype = Object.create(UserDataManager.prototype);