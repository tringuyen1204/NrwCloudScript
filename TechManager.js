TechManager = function (playerId) {
    DataManager.call(this, TECH, playerId);
};

HeroManager.prototype.GetHandler = function (args) {
    var type = args.type;
    for (var a = 0; a < TECH_LIST.length; a++) {
        if (TECH_LIST[a] === type) {
            return DataManager.prototype.GetHandler.call(this, args);
        }
    }
    return null;
};

TechManager.prototype = Object.create(DataManager.prototype);