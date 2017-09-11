function Profile() {

    this.Init = function () {
        var data = {};
        var sampleString = server.GetTitleInternalData({
            "Keys": [
                "DataSample"
            ]
        }).Data["DataSample"];

        var castle, farm, market, goldStorage, foodStorage;

        var random = Math.randomBetween(0, 1000);

        var k;

        var sampleData = JSON.parse(sampleString);

        for (k in sampleData) {
            var d = sampleData[k];
            if (d.SpawnRate[0] <= random && random < d.SpawnRate[1]) {
                break;
            }
        }

        castle = {
            "0": {
                "Level": Number(k),
                "CompletedDate": 0,
                "Upgrading": false,
                "Position": "s01"
            }
        };

        var sData = sampleData[k];

        var building = {};

        building[CASTLE] = castle;
        building[FARM] = this.GenerateProductionData(sData);
        building[MARKET] = this.GenerateProductionData(sData);
        building[GOLD_STORAGE] = this.GenerateStorageData(sData);
        building[FOOD_STORAGE] = this.GenerateStorageData(sData);

        var res = {
            Gold: {
                Value: 1000,
                Max: 10000
            },
            Food: {
                Value: 1000,
                Max: 10000
            }
        };

        server.UpdateUserReadOnlyData({
            "PlayFabId": currentPlayerId,
            "Data": {
                "Building": JSON.stringify(building),
                "Resource": JSON.stringify(res)
            }
        });

        var gloryPoint = Math.randomBetween(sData.GloryPoint[0], sData.GloryPoint[1]);

        var m = new MatchMaking();
        m.UpdateBattlePoint(gloryPoint);
    };

    this.GenerateProductionData = function (args) {

        var farmCount = Math.randomBetween(args.FarmCount[0], args.FarmCount[1]);
        var ret = {};

        for (var a = 0; a < farmCount; a++) {
            var farmData = {};
            farmData.Level = Math.randomBetween(args.FarmLvl[0], args.FarmLvl[1]);
            farmData.Upgrading = false;
            farmData.CompletedDate = 0;
            farmData.LastCollectDate = Date.now();

            ret[String(a)] = farmData;
        }

        return ret;
    };

    this.GenerateStorageData = function (args) {
        var storageCount = Math.randomBetween(args.StorageCount[0], args.StorageCount[1]);
        if (storageCount === 0) {
            storageCount = 1;
        }
        var ret = {};

        for (var a = 0; a < storageCount; a++) {
            var storageData = {};
            storageData.Level = Math.randomBetween(args.StorageLvl[0], args.StorageLvl[1]);
            storageData.Upgrading = false;
            storageData.CompletedDate = 0;
            ret[String(a)] = storageData;
        }

        return ret;
    };
}

/**
 * @returns {number}
 */
Math.randomBetween = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};