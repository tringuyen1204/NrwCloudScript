function BuildHandler(type) {
  DataHandler.call(this, type);

  this.RefreshStorage = function (code) {

    if (code === null) {
      code = this.type === GOLD_STORAGE ? GOLD : FOOD;
    }

    var newMax = 0;
    var key = "Castle" + code + "Storage";

    newMax += TitleData.Get(key);

    var k;
    for (k in this.Data) {
      if (this.Data.hasOwnProperty(k)) {
        newMax += this.CurLvlData(k)[code + "Capacity"];
      }
    }

    log.info("New " + code + " capacity = " + newMax);

    var resMan = new ResHandler();
    resMan.SetMax(code, newMax);
  };

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
