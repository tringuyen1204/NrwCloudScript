function Building(type) {
    DataHandler.call(this, type);

    this.RefreshStorageCap = function (code) {

        if (code === null) {
            code = this.Type === GOLD_STORAGE ? GOLD : FOOD;
        }

        var newMax = 0;
        var str = "Castle" + code + "Storage";
        var result = server.GetTitleData([str]).Data[str];

        newMax += Number(result);

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

    this.Push = function (args) {
        if ((args.type === GOLD_STORAGE || args.type === FOOD_STORAGE)
            && (args.command === COMPLETE_UPGRADE || args.command === BOOST_UPGRADE)) {
            this.RefreshStorageCap();
        }
        this.PushNow();
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

Building.prototype = Object.create(DataHandler.prototype);