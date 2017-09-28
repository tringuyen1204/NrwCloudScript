// resource code
const GOLD = "Gold";
const FOOD = "Food";
const CROWN = "Crown";

const MAT = {
 TRUFFLE: "Truffle",
 SILK: "Silk",
 PEARL: "Pearl",
 ARTIFACT: "Artifact",
 FUR: "Fur",
 JADE: "Jade"
};

const BUILDING = "Building";
const HERO = "Hero";
const TECH = "Tech";
const INV = "Inventory";
const GENERAL = "General";
const ADVISOR = "Advisor";
const TROOP = "Troop";
const MERC = "Merc";

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

// building cmd
const CMD_UPGRADE = "Upgrade";
const CMD_BOOST_UPGRADE = "BoostUpgrade";
const CMD_CHANGE_TROOP = "ChangeTroop";
const CMD_BOOST_TRAIN = "BoostTrain";
const CMD_BOOST_TRAIN_ALL = "BoostTrainAll";
const CMD_COLLECT = "Collect";
const CMD_COMPLETE_UPGRADE = "CompleteUpgrade";
const CMD_INSTANT_UPGRADE = "InstantUpgrade";
const CMD_EVOLVE = "Evolve";

// raid cmd
const CMD_FIND_ENEMIES = "FindEnemies";
const CMD_SCOUT = "Scout";
const CMD_START_BATTLE = "StartBattle";
const CMD_UPDATE_BATTLE = "UpdateBattle";
const CMD_END_BATTLE = "EndBattle";



const GP = "GloryPoint";

const TECH_LIST = [
 TROOP + INF,
 TROOP + SKR,
 TROOP + CAV,
 MERC + INF,
 MERC + SKR,
 MERC + CAV
];

const ATK = "Attack";
const DEF = "Defence";
const RES = "Resource";
const RAID = "Raid";
const LOGS = "Logs";


TitleData = {};

TitleData.GetConstObject = function (key) {
 return JSON.parse(TitleData.GetConst(key));
};

TitleData.Get = function (key) {
 if (!TitleData.hasOwnProperty(key)) {
  var str = server.GetTitleInternalData([key]).Data[key];
  TitleData[key] = JSON.parse(str);
 }
 return TitleData[key];
};

TitleData.GetConst = function (key) {
 var constant = TitleData.Get("Constant");
 if (key in constant) {
  return constant[key].Value;
 }
 return null;
};


