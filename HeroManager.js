HeroManager = function (playerId) {
 DataManager.call(this, [HERO, INV], playerId);

 this.GetHandler = function (args) {
  var handler = new HeroHandler();
  handler.Data = this.Data;
  return handler;
 }
};

HeroManager.prototype = Object.create(DataManager.prototype);