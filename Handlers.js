/**
 * @returns {string}
 */
handlers.ServerTime = function (args) {
    return String(Date.now());
};

handlers.UpdateBuilding = function (args) {
    var b = new BuildingManager();
    b.Execute(args);
};

handlers.Scout = function (args) {
    var b = new BuildingManager(args.target);
    var ret = b.AllProduceResource(args);
    var resMan = new ResHandler(args.target);

    var gold = Math.floor(resMan.ValueOf(GOLD) * 0.25);
    var food = Math.floor(resMan.ValueOf(FOOD) * 0.25);
    ret[GOLD] = gold;
    ret[FOOD] = food;

    server.UpdateUserReadOnlyData({
        "PlayFabId": currentPlayerId,
        "Data": {
            "Raid": JSON.stringify(ret)
        },
        "Permission": "public"
    });

    return ret;
};

handlers.FindEnemies = function (args) {
    return MatchMaking.FindEnemies(args);
};

// account creation handler
handlers.InitData = function(args){
    var p = new Profile();
    p.Init();
};

handlers.Raid = function (args) {

    if (!args.hasOwnProperty("result")) {
        args.result = Math.random() > 0.4;
    }

    if (args.result) {
        log.info("Attacker win!");

        var b = new BuildingManager(args.target);
        b.ApplyRaid(args);

        var r = new ResHandler(args.target);
        r.ApplyRaid(args);


        var resMan = new ResHandler();
        var raidData;

        var rawData = server.GetUserReadOnlyData({
            "PlayFabId": this.PlayerId,
            "Keys": ["Raid"]
        }).Data;

        if (rawData.hasOwnProperty(this.Key)) {
            raidData = JSON.parse(rawData[this.Key].Value);
        }

        resMan.Change(GOLD, raidData[GOLD] + raidData["ProducedGold"]);
        resMan.Change(FOOD, raidData[FOOD] + raidData["ProducedFood"]);
        resMan.Push();
    }
    else {
        log.info("Attacker lose");
    }

    MatchMaking.ApplyRaidResult(args);
};