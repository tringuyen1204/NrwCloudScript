HeroManager = function (playerId) {
 DefaultManager.call(this, [HERO, INV], playerId);

 this.GetHandler = function (args) {
  var handler = new HeroHandler();
  handler.Data = this.GetData();
  return handler;
 }
};

HeroManager.prototype = Object.create(DefaultManager.prototype);