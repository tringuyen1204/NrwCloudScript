HeroManager = function (playerId) {
 DataManager.call(this, [HERO, INV], playerId);

 this.GetHandler = function (args) {
  var hanldler = new HeroHandler();
  hanldler.Data = this.Data;
 }
};

HeroManager.prototype = Object.create(DataManager.prototype);