HeroManager = function (playerId) {
    DataManager.call(this, HERO, playerId);
};

HeroManager.prototype = Object.create(DataManager.prototype);

HeroManager.prototype.GetHandler = function (args) {
    var handlers = this.Handlers;
    var type = args.type;

    if (handlers.hasOwnProperty(type)) {
        handlers[type] = new HeroHandler(type);
        handlers[type].Data = this.Data;
    }
    return handlers[type];
};