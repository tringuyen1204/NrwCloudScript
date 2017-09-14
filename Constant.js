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
const ONE_MINUTE = 60 * 1000;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;

const UPGRADE = "Upgrade";
const BOOST_UPGRADE = "BoostUpgrade";
const CHANGE_TROOP = "ChangeTroop";
const BOOST_TRAIN = "BoostTrain";
const BOOST_TRAIN_ALL = "BoostTrainAll";
const COLLECT = "Collect";
const COMPLETE_UPGRADE = "CompleteUpgrade";
const INSTANT_UPGRADE = "InstantUpgrade";

const EVOLVE = "Evolve";

Constant = {
    Data: null
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