function BuildManager(playerId, loadedData) {

 if (loadedData === null || loadedData === undefined) {
  DataManager.call(this, [BUILDING], playerId);
 }
 else {
  this.Data = {};
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
  return handlers[type];
 }
}

BuildManager.prototype = Object.create(DataManager.prototype);

