// resource code
const GOLD = "Gold";
const FOOD = "Food";
const SILK = "Silk";
const PEARL = "Pearl";
const ARTIFACT = "Artifact";
const FUR = "Fur";
const JADE = "Jade";

const BUILDING = "Building";
const HERO = "Hero";
const TECH = "Tech";

// building code
const CASTLE = "Castle";
const MARKET = "Market";
const FARM = "Farm";
const GOLD_STORAGE = "GoldStorage";
const FOOD_STORAGE = "FoodStorage";
const BARRACK = "Barrack";

// cash code
const DIAMOND = "DI";

const INF = "Infantry";
const SKR = "Skirmisher";
const CAV = "Cavalry";

// time
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const CMD_UPGRADE = "Upgrade";
const CMD_BOOST_UPGRADE = "BoostUpgrade";
const CMD_CHANGE_TROOP = "ChangeTroop";
const CMD_BOOST_TRAIN = "BoostTrain";
const CMD_BOOST_TRAIN_ALL = "BoostTrainAll";
const CMD_COLLECT = "Collect";
const CMD_COMPLETE_UPGRADE = "CompleteUpgrade";
const CMD_INSTANT_UPGRADE = "InstantUpgrade";
const CMD_EVOLVE = "Evolve";

const NATION = "Nation";
const MERC = "Merc";

const TECH_LIST = [
    NATION + INF,
    NATION + SKR,
    NATION + CAV,
    MERC + INF,
    MERC + SKR,
    MERC + CAV
];

const PLAYER_ID = currentPlayerId;

TitleData = {};

TitleData.Get = function (key) {

    if (!TitleData.hasOwnProperty(key)) {
        var str = server.GetTitleData([key]).Data[key];
        TitleData[key] = JSON.parse(str);
    }
    return TitleData[key];
};

TitleData.GetConstant = function (key) {
    var constant = TitleData.Get("Constant");

    if (key in constant) {
        return constant;
    }
    return null;
};