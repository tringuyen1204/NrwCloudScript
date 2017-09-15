// resource code
const GOLD = "Gold";
const FOOD = "Food";
const SILK = "Silk";
const PEARL = "Pearl";
const ARTIFACT = "Artifact";
const FUR = "Fur";
const JADE = "Jade";

const BUILDING = "BuildingHandler";
const HERO = "Hero";
const TECH = "Tech";

// building code
const CASTLE = "Castle";
const MARKET = "Market";
const FARM = "Farm";
const GOLD_STORAGE = "GoldStorage";
const FOOD_STORAGE = "FoodStorage";
const BARRACK = "BarrackHandler";

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

const PLAYER_ID = currentPlayerId;

Constant = {
    Data: null
};

Constant.GetTitleData = function (key) {
    var str = server.GetTitleData([key]).Data[key];
    return JSON.parse(str);
};

Constant.Get = function (key) {
    if (Constant.Data === null) {
        var str = server.GetTitleData(["Constant"]).Data["Constant"];
        Constant.Data = JSON.parse(str);
    }

    if (key in Constant.Data) {
        return Constant.Data[key];
    }
    return null;
};