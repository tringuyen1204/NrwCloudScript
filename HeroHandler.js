function HeroHandler() {
 DataHandler.call(this, "Hero");
 this.base = new DataHandler();

 this.UsePieces = function (id, qty) {
  var inventory = this.Data[INV];
  if (id in inventory) {
   if (inventory[id] >= qty) {
    inventory[id] -= qty;
    return true;
   }
   else {
    return false;
   }
   return false;
  }
 };

 this.Evolve = function (args) {

  var id = args.id;
  var heroData = this.Get(id);
  var minRarity = TitleData.GetConst(id.toUpperCase() + "_RARITY");

  var unlocked = true;
  var pieceReqList = TitleData.GetConstObject("HERO_PIECES");

  if (heroData === null || heroData === undefined || heroData.Rarity < minRarity) {
   unlocked = false;
   heroData = {
    Rarity: 0,
    Lvl: 1
   }
  }
  else if (heroData.Rarity >= pieceReqList.length) {
   return false;
  }

  var pieceReq = 0;
  var pieceId = TitleData.GetConst(id.toUpperCase() + "_PIECE");
  var targetRarity = 0;

  if (unlocked) {
   pieceReq = pieceReqList[heroData.Rarity - 1];
   targetRarity = heroData.Rarity + 1;
  }
  else {
   for (var a = 0; a < minRarity; a++) {
    pieceReq += pieceReqList[a];
    targetRarity = minRarity;
   }
  }

  if (this.UsePieces(pieceId, pieceReq)) {
   heroData.Rarity = targetRarity;
   return true;
  }
  return false;
 };

 this.Run = function (args) {
  var ret = this.base.Run.call(this, args);

  if (!ret) {
   switch (args.command) {
    case CMD_EVOLVE:
     return this.Evolve(args);
   }
  }
  return ret;
 };
}

HeroHandler.prototype = Object.create(DataHandler.prototype);
