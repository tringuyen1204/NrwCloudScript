function BuildManager(playerId, loadedData) {

 if (loadedData === null || loadedData === undefined) {
  DataManager.call(this, [BUILDING], playerId);
 }
 else {
  DataManager.call(this, [], playerId);
  this.Data[BUILDING] = loadedData;
 }

 this.ProducedResource = function (args) {
  var date = this.FormatData(args);
  var pGold = this.GetHandler(MARKET).AllResource(date) * 0.5;
  var pFood = this.GetHandler(FARM).AllResource(date) * 0.5;

  return {
   ProducedGold: Math.floor(pGold),
   ProducedFood: Math.floor(pFood)
  }
 };

 this.ApplyRaid = function (args) {
  var date = this.FormatData(args);
  this.GetHandler(MARKET).ApplyRaid(date, args.rate);
  this.GetHandler(FARM).ApplyRaid(date, args.rate);
  this.PushNow();
 };

 this.Push = function (args) {
  if ("command" in args) {
   if (( args.type === GOLD_STORAGE || args.type === FOOD_STORAGE )
    && ( args.command === CMD_COMPLETE_UPGRADE || args.command === CMD_BOOST_UPGRADE )) {

    this.RefreshStorage();
   }
  }
  this.PushNow();
 };

 this.RefreshStorage = function (code) {

  if (code === null) {
   code = this.type === GOLD_STORAGE ? GOLD : FOOD;
  }

  var newMax = 0;
  var key = "Castle" + code + "Storage";

  newMax += TitleData.GetConstant(key);

  var bData = this.Data[BUILDING][code];

  var k;
  for (k in bData) {
   newMax += this.CurLvlData(k)[code + "Capacity"];
  }

  var resMan = new ResManager();
  resMan.SetMax(code, newMax);
 };

 this.GetHandler = function (args) {

  var type = args.type;

  var newHandler = null;

  switch (type) {
   case FARM:
   case MARKET:
    newHandler = new ResBuildHandler(type);
    break;
   case BARRACK:
    newHandler = new BarrackHandler(type);
    break;
   case CASTLE:
   case FOOD_STORAGE:
   case GOLD_STORAGE:
    newHandler = new BuildHandler(type);
    break;
  }

  if (newHandler === null) {
   return null;
  }

  newHandler.Data = this.Data[BUILDING];
  return newHandler;
 }

}

BuildManager.prototype = Object.create(DataManager.prototype);

