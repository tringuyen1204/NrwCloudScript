var Handler = {};

/**
 *
 * @param id
 * @param pId = null
 * @returns {*}
 * @constructor
 */
Handler.FromId = function (id, pId) {
    switch (Handler.GetClass(id)) {
        case BUILDING:
            switch (Handler.GetType(id)) {
                case MARKET:
                case FARM:
                    return new ResBuildHandler(pId);
                case BARRACK:
                    return new BarrackHandler(pId);
                default:
                    return new BuildHandler(pId);
            }
        case HERO:
            return new HeroHandler(pId);
        case TECH:
            return new TechHandler(pId);
        case RESOURCE:
            return new ResHandler(pId);
    }
};

Handler.GetClass = function (id) {
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

Handler.GetType = function (id) {
    return id.split('.')[1];
};