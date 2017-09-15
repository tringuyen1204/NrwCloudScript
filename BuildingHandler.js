BuildingHandler = function (type) {
    DataHandler.call(this, type);
};

BuildingHandler.prototype = Object.create(DataHandler.prototype);

BuildingHandler.prototype.RefreshStorageCap = function (code) {

    if (code === null) {
        code = this.type === GOLD_STORAGE ? GOLD : FOOD;
    }

    var newMax = 0;
    var key = "Castle" + code + "Storage";

    newMax += TitleData.GetConstant(key);

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

BuildingHandler.prototype.DefaultData = function (args) {
    return {
        "Level": 0,
        "Upgrading": false,
        "CompletedDate": 0,
        "Position": args.position
    }
};