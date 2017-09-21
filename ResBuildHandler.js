function ResBuildHandler(type) {
 BuildHandler.call(this, type);

 this.base = new BuildHandler(type);

 this.CompleteUpgrade = function (args) {
  if (BuildHandler.prototype.CompleteUpgrade.call(this, args)) {
   this.Get(args.id).CollectDate = args.date;
   return true;
  }
  return false;
 };

 this.DefaultData = function (args) {
  return {
   "Lvl": 0,
   "CollectDate": args.date,
   "Pos": args.position
  }
 };

 this.Run = function (args) {
  var ret = this.base.Run(args);
  if (!ret) {
   switch (args.command) {
    case CMD_COLLECT:
     return handler.Collect(args);
   }
  }
  return ret;
 };

 this.Upgrade = function (args) {
  this.Collect(args.id, args.date);
  return BuildHandler.prototype.Upgrade.call(this, args);
 };

 this.Collect = function (args) {

  var id = args.id;
  var date = args.date;

  var bData = this.Get(id);

  if (bData === null || bData.Lvl === 0 || ("FinishDate" in bData)) {
   return false;
  }

  var code = (this.type === MARKET) ? GOLD : FOOD;
  var produceRate = this.CurLvlData(id).ProduceRate;
  var amount = this.ProducedResource(id, date);

  if (amount > 0) {

   var resMan = new ResManager();

   var curRes = resMan.ValueOf(code);
   var curMax = resMan.MaxOf(code);

   if (amount + curRes > curMax) {
    resMan.Change(code, curMax - curRes);
    amount -= curMax - curRes;
   }
   else {
    resMan.Change(code, amount);
    amount = 0;
   }

   bData.CollectDate = Math.floor(date - (amount / produceRate) * HOUR);

   return true;
  }
  else {
   return false;
  }
 };

 this.CollectAll = function (args) {
  var k;
  for (k in this.Data[this.type]) {
   this.Collect(k, args.date);
  }
  return true;
 };

 this.ProducedResource = function (id, date) {

  var bData = this.Get(id);

  if (bData === null || bData.Lvl === 0 || bData.IsUp) {
   return 0;
  }

  var produceRate = this.CurLvlData(id).ProduceRate;
  var workingTime = ( date - bData.CollectDate ) / HOUR;
  var amount = Math.floor(workingTime * produceRate);

  var code = (this.type === MARKET) ? GOLD : FOOD;

  var capacity = this.CurLvlData(id)[code + "Capacity"];

  if (amount > capacity) {
   amount = capacity;
  }
  return amount;
 };

 this.AllResource = function (date) {
  var total = 0;
  var k;

  for (k in this.Data[this.type]) {
   total += this.ProducedResource(k, date);
  }
  return total;
 };

 this.ApplyRaid = function (date, rate) {
  var k;
  for (k in this.Data[this.type]) {
   this.ReduceProduction(k, date, rate);
  }
 };

 this.ReduceProduction = function (id, date, rate) {
  var bData = this.Get(id);

  var code = (this.type === MARKET) ? GOLD : FOOD;
  var produceRate = this.CurLvlData(id).ProduceRate;
  var amount = this.ProducedResource(id, date);

  amount *= (1 - rate);
  bData.CollectDate = Math.floor(date - amount / produceRate * HOUR);
 };
}

ResBuildHandler.prototype = Object.create(BuildHandler.prototype);

