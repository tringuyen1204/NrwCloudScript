var HandlerPool = {};

HandlerPool.HandlerFromId = function (id, playerId) {
    switch (HandlerPool.GetClass(id)) {
        case BUILDING:
            switch (HandlerPool.GetType(id)) {
                case MARKET:
                case FARM:
                    return new ResBuildHandler(playerId);
                case BARRACK:
                    return new BarrackHandler(playerId);
                default:
                    return new BuildHandler(playerId);
            }
        case HERO:
            return new HeroHandler(playerId);
        case TECH:
            return new TechHandler(playerId);
        case RESOURCE:
            return new ResHandler(playerId);
    }
};

HandlerPool.GetClass = function (id) {
    var temp = id.split('.')[0];
    switch (temp) {
        case BUILDING:
            return BUILDING;
        case GENERAL:
        case ADVISOR:
            return HERO;
        case TECH:
            return TECH;
        case TROOP:
            return TROOP;
        case MERC:
            return INV;
        case RESOURCE:
            return RESOURCE;
    }
};

HandlerPool.GetType = function (id) {
    return id.split('.')[1];
};