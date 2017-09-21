function DataHandler(type) {
 this.type = type;

 this.MasterData = function () {
  if (!("mData" in this)) {
   this.mData = TitleData.Get(this.type);
  }
  return this.mData;
 };

 this.Run = function (args) {
  switch (args.command) {
   case CMD_UPGRADE:
    return this.Upgrade(args);
   case CMD_COMPLETE_UPGRADE:
    return this.CompleteUpgrade(args);
   case CMD_INSTANT_UPGRADE:
    return this.InstantUpgrade(args);
   case CMD_BOOST_UPGRADE:
    return this.BoostUpgrade(args);
  }
  return false;
 };

 this.CurLvlData = function (id) {
  return this.MasterData()[String(this.Get(id).Lvl)];
 };

 this.NxtLvlData = function (id) {
  return this.MasterData()[String(this.Get(id).Lvl + 1)];
 };

 this.DefaultData = function (args) {
  return {
   "Lvl": 0,
   "Upgrading": false,
   "CompletedDate": 0
  }
 };

 this.InstantUpgrade = function (args) {
  var id = args.id;

  var nxtLv = this.NxtLvlData(id);

  var missRes = 0;

  if ("GoldCost" in nxtLv) {
   missRes += nxtLv.GoldCost;
  }

  if ("FoodCost" in nxtLv) {
   missRes += nxtLv.FoodCost;
  }

  var cost = Converter.GoldFoodToDiamond(resCost) + Converter.TimeToDiamond(nxtLv.UpTime);
  cost = Math.floor(cost * 0.9);

  var resMan = new ResManager();

  if (Currency.Spend(DIAMOND, cost)) {
   this.Get(id).IsUp = true;
   this.CompleteUpgrade(args);
  }
 };

 this.Upgrade = function (args) {

  var id = args.id;
  var date = args.date;

  if (this.Get(id) === null) {
   this.Data[this.type][id] = this.DefaultData(args);
  }

  if (!this.CanUpgrade(id)) {
   return false;
  }

  var nxtLv = this.NxtLvlData(id);

  var missRes = 0;
  var needGold = false;
  var needFood = false;

  var resMan = new ResManager();

  var data = this.Get(id);

  if (nxtLv.GoldCost !== null) {
   if (resMan.ValueOf(GOLD) < nxtLv.GoldCost) {
    missRes += nxtLv.GoldCost - resMan.ValueOf(GOLD);
    needGold = true;
   }
  }

  if (nxtLv.FoodCost !== null) {
   if (resMan.ValueOf(FOOD) < nxtLv.FoodCost) {
    missRes += nxtLv.FoodCost - resMan.ValueOf(FOOD);
    needFood = true;
   }
  }

  var cost = 0;

  if (missRes > 0) {
   cost = Converter.GoldFoodToDiamond(missRes);
   log.info("diamond needed = " + cost);
  }

  if ((cost === 0)
   || (cost > 0 && Currency.Spend(DIAMOND, cost) )) {
   if (needGold) {
    resMan.Change(GOLD, -resMan.ValueOf(GOLD));
   }
   else if (nxtLv.GoldCost !== null) {
    resMan.Change(GOLD, -nxtLv.GoldCost);
   }

   if (needFood) {
    resMan.Change(FOOD, -resMan.ValueOf(FOOD));
   }
   else if (nxtLv.FoodCost !== null) {
    resMan.Change(FOOD, -nxtLv.FoodCost);
   }

   resMan.Push();

   data.CompletedDate = date + nxtLv.UpTime;
   data.IsUp = true;
   this.AddWorkder(this.type, id);
  }
  else {
   return false;
  }

  return true;
 };

 this.CompleteUpgrade = function (args) {

  var id = args.id;
  var data = this.Get(id);
  data.Lvl++;
  data.IsUp = false;

  var kingdom = new Kingdom();
  kingdom.AddExp(this.CurLvlData(id).Exp);
  this.RemoveWorker(this.type, id);
 };

 this.CanUpgrade = function () {

  if (this.GetWorkers().length > 1) {
   log.error("Max worker reaches");
   return false;
  }
  else if (this.Get(id).IsUp) {
   log.error("IsUp in progress");
   return false;
  }
  return true;
 };

 this.BoostUpgrade = function (args) {
  var id = args.id;
  var date = args.date;

  if (this.Completed(id, date)) {
   log.error("this building has been completed!");
  } else {

   var remainTime = ( this.Get(id).CompletedDate - date );
   var diamondNeed = Converter.TimeToDiamond(remainTime);

   if (Currency.Spend(DIAMOND, diamondNeed)) {
    return this.CompleteUpgrade(id, date);
   }
  }
  return false;
 };

 this.Completed = function (id, date) {
  return this.Get(id).CompletedDate <= date;
 };

 this.AddWorkder = function (type, id) {
  this.GetWorkers().push({
   "type": this.type,
   "Id": id
  });
 };

 this.GetWorkers = function () {
  if (!this.Data.hasOwnProperty("Workers")) {
   this.Data.Workers = [];
  }
  return this.Data.Workers;
 };

 this.RemoveWorker = function (type, id) {

  var executors = this.GetWorkers();
  var index = -1;
  for (var a = 0; a < executors.length; a++) {
   var data = executors[a];
   if (data.Id === id && data.type === type) {
    index = a;
    break;
   }
  }
  if (index !== -1) {
   executors.splice(index, 1);
  }
 };

 this.Get = function (id) {
  if (this.Data[this.type].hasOwnProperty(id)) {
   return this.Data[this.type][id];
  }
  else {
   return null;
  }
 };
}
