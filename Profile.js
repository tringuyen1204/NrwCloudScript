Profile = function () {
  this.Init = function () {
    var sampleString = server.GetTitleInternalData({
      "Keys": [
        "DataSample"
      ]
    }).Data["DataSample"];

    var castle;

    var random = Math.randomBetween(0, 1000);

    var k;

    var sampleData = JSON.parse(sampleString);

    for (k in sampleData) {
      if (sampleData.hasOwnProperty(k)) {
        var d = sampleData[k];
        if (d.SpawnRate[0] <= random && random < d.SpawnRate[1]) {
          break;
        }
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

    var index = 0;
    var b = {};

    b[CASTLE] = castle;

    var ret;

    ret = this.SpawnFarms(sData, index);
    b[FARM] = ret["Data"];
    index = ret["Index"];

    ret = this.SpawnFarms(sData, index);
    b[MARKET] = ret["Data"];
    index = ret["Index"];

    ret = this.SpawnStorages(sData, index);
    b[FOOD_STORAGE] = ret["Data"];
    index = ret["Index"];

    ret = this.SpawnStorages(sData, index);
    b[GOLD_STORAGE] = ret["Data"];

    var res = {
      Gold: {
        Value: Math.randomBetween(1000, 10000),
        Max: 10000
      },
      Food: {
        Value: Math.randomBetween(1000, 10000),
        Max: 10000
      }
    };

    server.UpdateUserReadOnlyData({
      "PlayFabId": currentPlayerId,
      "Data": {
        "UpdateBuilding": JSON.stringify(b),
        "Resource": JSON.stringify(res)
      },
      "Permission": "public"
    });

    var gloryPoint = Math.randomBetween(sData.GloryPoint[0], sData.GloryPoint[1]);

    GloryPoint.Set(gloryPoint);

    return true;
  };

  this.SpawnFarms = function (args, index) {

    var farmCount = Math.randomBetween(args.FarmCount[0], args.FarmCount[1]);
    var ret = {};

    ret.Data = {};

    for (var a = 0; a < farmCount; a++) {

      var pos = "c";

      if (++index < 10) {
        pos += "0" + index;
      }
      else {
        pos += index;
      }

      var fData = {};
      fData.Level = Math.randomBetween(args.FarmLvl[0], args.FarmLvl[1]);
      fData.Upgrading = false;
      fData.CompletedDate = 0;
      fData.CollectDate = Date.now() - Math.randomBetween(HOUR, 12 * HOUR);
      fData.Position = pos;

      ret.Data[String(a)] = fData;
    }
    ret.Index = index;

    return ret;
  };

  this.SpawnStorages = function (args, index) {

    var storageCount = Math.randomBetween(args.StorageCount[0], args.StorageCount[1]);
    var ret = {};
    ret.Data = {};

    for (var a = 0; a < storageCount; a++) {

      var pos = "c";

      pos += ++index < 10 ? "0" + index : index;

      var sData = {};
      sData.Level = Math.randomBetween(args.StorageLvl[0], args.StorageLvl[1]);
      sData.Upgrading = false;
      sData.CompletedDate = 0;
      sData.Position = pos;

      ret.Data[String(a)] = sData;
    }
    ret.Index = index;

    return ret;
  };
};
