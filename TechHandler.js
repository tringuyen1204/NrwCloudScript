function TechHandler(playerId) {
    UpgradeHandler.call(this, playerId, [TECH]);
}

TechHandler.prototype = Object.create(UpgradeHandler.prototype);
