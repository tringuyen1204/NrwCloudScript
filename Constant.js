const MAT = {
    TRUFFLE: "Truffle",
    SILK: "Silk",
    PEARL: "Pearl",
    ARTIFACT: "Artifact",
    FUR: "Fur",
    JADE: "Jade"
};

const RES = {
    GOLD: "Resource.Gold",
    FOOD: "Resource.Food",
    CROWN: "Resource.Crown"
};

const BUILDING = "Building";
const HERO = "Hero";
const TECH = "Tech";
const INV = "Inventory";
const GENERAL = "General";
const ADVISOR = "Advisor";
const TROOP = "Troop";
const MERC = "Merc";

const FOOD_CAP = "FoodCap";
const GOLD_CAP = "GoldCap";

// building code
const CASTLE = "Castle";
const MARKET = "Market";
const FARM = "Farm";
const GOLD_STORAGE = "GoldStorage";
const FOOD_STORAGE = "FoodStorage";
const BARRACK = "Barrack";

const TROOP_MATCH_HASH = {
    Infantry: "Swordsman",
    Skirmisher: "Bowman",
    Cavalry: "Horseman"
};

function TroopNameToClass(name) {
    switch (name) {
        case "Swordsman":
        case "Samurai":
        case "Vandal":
            return INF;

        case "Bowman":
        case "Longbowman":
        case "Chukonu":
            return SKR;

        case "Horseman":
        case "Chevalier":
        case "Jaesong Cavalry":
            return CAV;
    }

    return null;
}

// cash code
const DIAMOND = "DI";

const INF = "INF";
const SKR = "SKR";
const CAV = "CAV";

// time
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;


const CMD = {
    // for building, tech, hero
    UPGRADE: {
        BASE: "Upgrade",
        BOOST: "BoostUpgrade",
        COMPLETE: "CompleteUpgrade",
        INSTANT: "InstantUpgrade"
    },

    RESOURCE: {
        COLLECT: "Collect"
    },

    BARRACK: {
        CHANGE_TROOP: "ChangeTroop",
        BOOST_TRAIN: "BoostTrain",
        BOOST_ALL: "BoostTrainAll"
    },

    BATTLE: {
        FIND_ENEMIES: "FindEnemies",
        SCOUT: "Scout",
        START: "StartBattle",
        UPDATE: "UpdateBattle",
        END: "EndBattle"
    },

    HERO: {
        EVOLVE: "Evolve"
    }
};

const GP = "GloryPoint";

const ATK = "Attack";
const DEF = "Defence";
const RESOURCE = "Resource";
const LOGS = "Logs";

TitleData = {};

/**
 *
 * @param key
 * @constructor
 */
TitleData.GetConstObject = function (key) {
    return JSON.parse(TitleData.GetConst(key));
};

/**
 *
 * @param key
 * @returns {*}
 * @constructor
 */
TitleData.Get = function (key) {
    if (!TitleData.hasOwnProperty(key)) {
        var str = server.GetTitleInternalData([key]).Data[key];
        TitleData[key] = JSON.parse(str);
    }
    return TitleData[key];
};

/**
 *
 * @param key
 * @returns {*}
 * @constructor
 */
TitleData.GetConst = function (key) {
    var constant = TitleData.Get("Constant");
    if (key in constant) {
        return constant[key].Value;
    }
    return null;
};


