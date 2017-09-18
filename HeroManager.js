HeroManager = function (playerId) {
 DataManager.call(this, HERO, playerId);

 this.GetHandler = function (args) {
  var handlers = this.Handlers;
  var type = args.type;

  for (var a = 0; a < HERO_LIST.length; a++) {
   if (HERO_LIST[a] === type) {
    if (handlers.hasOwnProperty(type)) {
     handlers[type] = new HeroHandler(type);
     handlers[type].Data = this.Data;
    }
    return handlers[type];
   }
  }
  return null;
 }
};

HeroManager.prototype = Object.create(DataManager.prototype);
