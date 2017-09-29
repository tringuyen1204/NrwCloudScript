function BuildManager(playerId, loadedData) {

    if (loadedData === null || loadedData === undefined) {
        DefaultManager.call(this, [BUILDING], playerId);
    }
    else {
        DefaultManager.call(this, [], playerId);
        this.Data[BUILDING] = loadedData;
    }

    this.ProducedResource = function (args) {
        args = this.FormatData(args);
        var pGold = this.GetHandler(MARKET).AllResource(args.date) * 0.5;
        var pFood = this.GetHandler(FARM).AllResource(args.date) * 0.5;

        return {
            ProducedGold: Math.floor(pGold),
            ProducedFood: Math.floor(pFood)
        }
    };

    this.GetTroopInfo = function (args) {
        args = this.FormatData(args);
        return this.GetHandler(BARRACK).GetTroopInfo(args);
    };

    this.ApplyRaid = function (args) {
        args = this.FormatData(args);
        this.GetHandler(MARKET).ApplyRaid(args.date, args.rate);
        this.GetHandler(FARM).ApplyRaid(args.date, args.rate);
        this.PushNow();
    };

    this.Push = function (args) {
        if ("command" in args) {
            if (( args.type === GOLD_STORAGE || args.type === FOOD_STORAGE )
                && ( args.command === CMD_COMPLETE_UPGRADE || args.command === CMD_BOOST_UPGRADE )) {

                this.RefreshStorage();
            }
        }
        this.PushNow();
    };

    this.RefreshStorage = function (code) {

        if (code === null) {
            code = this.type === GOLD_STORAGE ? GOLD : FOOD;
        }

        var newMax = 0;
        var key = "Castle" + code + "Storage";

        newMax += TitleData.GetConst(key);

        var bData = this.Data[BUILDING][code];

        var k;
        for (k in bData) {
            newMax += this.CurLvlData(k)[code + "Cap"];
        }

        var resMan = new ResManager();
        resMan.SetMax(code, newMax);
    };

    this.GetHandler = function (id) {

        var parts = id.split('.'); // 'Building.Farm.2' --> ['Building', 'Farm', '2']

        var handler;

        switch (parts[1]) {
            case FARM:
            case MARKET:
                handler = new ResBuildHandler();
                break;
            case BARRACK:
                handler = new BarrackHandler();
                break;
            case CASTLE:
            case FOOD_STORAGE:
            case GOLD_STORAGE:
                handler = new BuildHandler();
                break;
        }

        if (handler === undefined) {
            return null;
        }

        handler.Data = this.GetData();
        return handler;
    }

}

BuildManager.prototype = Object.create(DefaultManager.prototype);
