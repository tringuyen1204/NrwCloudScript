function BuildHandler(type) {
 DataHandler.call(this, type);

 this.DefaultData = function (args) {
  return {
   "Level": 0,
   "Upgrading": false,
   "CompletedDate": 0,
   "Position": args.position
  }
 };
}

BuildHandler.prototype = Object.create(DataHandler.prototype);
