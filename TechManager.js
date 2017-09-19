TechManager = function (playerId) {
 DataManager.call(this, TECH, playerId);
 this.GetHandler = function (args) {
  var type = args.type;
  for (var a = 0; a < TECH_LIST.length; a++) {
   if (TECH_LIST[a] === type) {
    var ret = DataManager.prototype.GetHandler.call(this, args);
    ret.Data = this.Data[TECH];
   }
  }
  return null;
 };
};
TechManager.prototype = Object.create(DataManager.prototype);