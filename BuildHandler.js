function BuildHandler(type) {
 DataHandler.call(this, type);

 this.DefaultData = function (args) {
  return {
   "Lvl": 0,
   "Pos": args.position
  }
 };
}

BuildHandler.prototype = Object.create(DataHandler.prototype);
