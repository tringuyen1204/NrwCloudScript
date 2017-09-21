function BarrackHandler(type) { BuildHandler.call(this, type); this.KillTroop = function (args) {  var id = args.id;  var date = args.date;  var amount = args.amount;  var bData = this.Get(id);  var realDate = this.RealDate(id, date);  if (bData.FinishTrainDate > realDate) {   bData.FinishTrainDate += amount * this.TrainTime(id);  }  else {   bData.FinishTrainDate = realDate + amount * this.TrainTime(id);  }  return true; }; this.Run = function (args) {  var ret = BuildHandler.prototype.Run.call(this, args);  if (!ret) {   switch (args.command) {    case CMD_CHANGE_TROOP:     return handler.ChangeTroop(args);    case CMD_BOOST_TRAIN:     return handler.BoostTrain(args);    case CMD_BOOST_TRAIN_ALL:     return handler.BoostTrainAll(args);   }  }  return ret; }; this.ChangeTroop = function (args) {  var id = args.id;  var date = args.date;  var type = args.troopType;  var bData = this.Get(id);  if (bData.Upgrading) {   log.error("This barrack is constructing!");   return false;  }  var curLvData = this.CurLvlData(id);  bData.TroopType = type;  var totalTroop = Math.floor(curLvData.TroopCapacity / this.TroopSize(id));  bData.FinishTrainDate = date + totalTroop * this.TrainTime(id);  return true; }; this.TrainTime = function (id) {  var k;  switch (this.Get(id).TroopType) {   case INF:    k = "InfantryTrainTime";    break;   case SKR:    k = "SkirmisherTrainTime";    break;   case CAV:    k = "CavalryTrainTime";    break;  }  return this.CurLvlData(id)[k]; }; this.TroopSize = function (id) {  if (this.Get(id).TroopType === CAV) {   return 2;  }  return 1; }; this.BoostTrainAll = function (args) {  var date = args.date;  var boostCost = 0;  var k;  for (k in this.Data) {   boostCost += this.GetBoostCost(k, date);  }  if (boostCost > 0 && Currency.Spend(DIAMOND, boostCost)) {   for (k in this.Data) {    this.Get(k).FinishTrainDate = date;   }   return true;  }  return false; }; this.BoostTrain = function (args) {  var id = args.id;  var date = args.date;  var boostCost = this.GetBoostCost(id, date);  if (boostCost > 0 && Currency.Spend(DIAMOND, boostCost)) {   this.Get(id).FinishTrainDate = date;   return true;  }  return false; }; this.GetBoostCost = function (id, date) {  if (!this.Get(id).Upgrading) {   var remainTime = this.Get(id).FinishTrainDate - date;   if (remainTime > 0) {    return Converter.TimeToDiamond(remainTime);   }  }  return 0; }; this.DefaultData = function (args) {  return {   "Level": 0,   "Upgrading": false,   "CompletedDate": 0,   "Position": args.position,   "FinishTrainDate": args.date,   "TroopType": "Infantry"  } }; this.CompleteUpgrade = function (args) {  BuildHandler.prototype.CompleteUpgrade.call(this, args);  var id = args.id;  var date = args.date;  var bData = this.Get(id);  var curLvData = this.CurLvlData(id);  if (bData.Level > 1) {   bData.FinishTrainDate += date - (bData.CompletedDate - curLvData.UpTime);  } }; this.RealDate = function (id, date) {  if (this.Get(id).Upgrading) {   return this.Get(id).CompletedDate - this.NxtLvlData(id).UpTime;  }  return date; }; this.TroopCount = function (id, date) {  var realDate = this.RealDate(id, date);  var bData = this.Get(id);  var curLvData = this.CurLvlData(id);  var totalTroop = Math.floor(curLvData.TroopCapacity / this.TroopSize(id));  if (bData.FinishTrainDate < realDate) {   return totalTroop;  }  else {   var remainTroop = ( bData.FinishTrainDate - realDate ) / this.TrainTime(id);   return Math.floor(totalTroop - remainTroop);  } }; this.GetTroopInfo = function (args) {  var k;  var data;  var ret = {};  for (k in this.Data[BARRACK]) {   data = this.Get(k);   if (!(data.TroopType in ret)) {    ret[data.TroopType] = {};   }   ret[data.TroopType].Lvl = 1;   ret[data.TroopType].Qty += this.TroopCount;  }  return ret; };}BarrackHandler.prototype = Object.create(BuildHandler.prototype);