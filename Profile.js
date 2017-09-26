Profile = function () {
 this.Init = function () {
  var sampleString = server.GetTitleData({
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
   "Lvl": Number(k),
   "Pos": "s01"
  };

  var sData = sampleData[k];

  var index = 0;
  var b = {};

  b["building.castle.0"] = castle;

  var ret;

  var a = 0;

  ret = this.SpawnFarms(sData, index);
  for (a = 0; a < ret.Data.length; a++) {
   b["building.farm." + a] = ret.Data[a];
  }
  index = ret["Index"];

  ret = this.SpawnFarms(sData, index);
  for (a = 0; a < ret.Data.length; a++) {
   b["building.market." + a] = ret.Data[a];
  }
  index = ret["Index"];

  ret = this.SpawnStorages(sData, index);
  for (a = 0; a < ret.Data.length; a++) {
   b["building.foodstorage." + a] = ret.Data[a];
  }
  index = ret["Index"];

  ret = this.SpawnStorages(sData, index);
  for (a = 0; a < ret.Data.length; a++) {
   b["building.goldstorage." + a] = ret.Data[a];
  }

  index = 0;
  ret = this.SpawnBarracks(sData, index);
  for (a = 0; a < ret.Data.length; a++) {
   b["building.barrack." + a] = ret.Data[a];
  }

  var res = {
   'resource.gold': {
    Value: Math.randomBetween(1000, 10000),
    Max: 10000
   },
   'resource.food': {
    Value: Math.randomBetween(1000, 10000),
    Max: 10000
   },
   'resource.crown': {
    Value: 0,
    Max: 10
   }
  };

  var writeData = {};
  writeData[BUILDING] = b;
  writeData[RES] = res;

  UserData.Update(writeData, currentPlayerId);

  var gloryPoint = Math.randomBetween(sData.GloryPoint[0], sData.GloryPoint[1]);

  GloryPoint.Set(gloryPoint);

  return true;
 };

 this.SpawnFarms = function (args, index) {

  var count = Math.randomBetween(args.FarmQty[0], args.FarmQty[1]);
  var ret = {};

  ret.Data = [];

  for (var a = 0; a < count; a++) {

   var pos = "c";
   pos += ++index < 10 ? "0" + index : index;

   var fData = {};
   fData.Lvl = Math.randomBetween(args.FarmLvl[0], args.FarmLvl[1]);
   fData.CollectDate = Date.now() - Math.randomBetween(HOUR, 12 * HOUR);
   fData.Pos = pos;

   ret.Data[a] = fData;
  }
  ret.Index = index;

  return ret;
 };

 this.SpawnBarracks = function (args, index) {
  var count = Math.randomBetween(args.BarrackQty[0], args.BarrackQty[1]);
  var ret = {};
  ret.Data = [];

  for (var a = 0; a < count; a++) {

   var pos = "m";
   pos += ++index < 10 ? "0" + index : index;

   var bData = {};
   bData.Lvl = Math.randomBetween(args.BarrackLvl[0], args.BarrackLvl[1]);
   bData.FinishTrainDate = ServerTime.Now();
   bData.Pos = pos;

   switch (Math.randomBetween(0, 2)) {
    case 0:
     bData.Class = INF;
     break;
    case 1:
     bData.Class = SKR;
     break;
    case 2:
     bData.Class = CAV;
     break;
   }
   ret.Data[a] = bData;
  }
  ret.Index = index;

  return ret;
 };

 this.SpawnStorages = function (args, index) {

  var count = Math.randomBetween(args.StorageQty[0], args.StorageQty[1]);
  var ret = {};
  ret.Data = [];

  for (var a = 0; a < count; a++) {

   var pos = "c";
   pos += ++index < 10 ? "0" + index : index;

   var sData = {};
   sData.Lvl = Math.randomBetween(args.StorageLvl[0], args.StorageLvl[1]);
   sData.Pos = pos;


   ret.Data[a] = sData;
  }
  ret.Index = index;

  return ret;
 };
};
