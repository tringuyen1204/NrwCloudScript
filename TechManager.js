TechManager = function (playerId) {
    DataManager.call(this, TECH, playerId);
};

TechManager.prototype = Object.create(DataManager.prototype);