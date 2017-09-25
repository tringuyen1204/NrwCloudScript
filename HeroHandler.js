function HeroHandler(type) {
 DataHandler.call(this, type);
 this.base = new DataHandler(type);

 this.PieceReqList = function () {
  return TitleData.GetConstant("HeroEvolution");
 };

 this.Evolve = function (args) {

  var id = args.id;

  var heroData = this.Get(id);
  var pieceReqList = this.PieceReqList();

  if (heroData.Star >= pieceReqList.length) {
   return false;
  }

  var shardReq = pieceReqList[heroData.Star - 1];

  if (heroData.Shards >= shardReq) {
   heroData.Shards -= shardReq;
   heroData.Star = heroData.Star + 1;
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
