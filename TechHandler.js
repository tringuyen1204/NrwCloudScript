function TechHandler(pId) {
    UpgradeHandler.call(this, pId, [TECH]);
}

TechHandler.prototype = Object.create(UpgradeHandler.prototype);