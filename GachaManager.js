function GachaManager() {

 var rawData = server.GetTitleInternalData([
  "DropTable",
  "Containers"
 ]).Data;

 this.DropTable = JSON.parse(rawData["DropTable"]);
 this.Containers = JSON.parse(rawData["Containers"]);

 this.OpenChest = function (args) {
  if (!("chestId" in args)) {
   log.error("chestId is null");
   return;
  }

  var chestId = args["chestId"];

  if (!(chestId in this.Containers)) {
   log.error("containers don't have this chest");
  }

  var chestData = this.Containers[chestId].Data;

  var ret = [];

  for (var a = 0; a < chestData.length; a++) {
   ret.push(this.SpinTable(chestData[a]));
  }
  return ret;
 };

 this.SpinTable = function (tableId) {

  if (!(tableId in this.DropTable)) {
   log.error("invalid table name: " + tableId);
  }

  var itemList = this.DropTable[tableId].Data;

  var cumulative = [];
  var total = 0;
  var a = 0;

  for (a = 0; a < itemList.length; a++) {

   if (a === 0) {
    cumulative[a] = itemList[a].weight;
   }
   else {
    cumulative[a] = itemList[a].weight + total;
   }
   total += cumulative[a];
  }

  var random = Math.randomBetween(1, total);

  for (a = 0; a < cumulative.length; a--) {
   if (random <= cumulative[a]) {
    break;
   }
  }

  if ("item" in itemList[a]) {

   var ret = {};
   ret.item = itemList[a].item;
   ret.qty = Math.randomBetween(itemList[a].range[0], itemList[a].range[1]);
   return ret;
  }
  else if ("table" in itemList[a]) {
   return this.SpinTable(itemList[a].table);
  }
  return null;
 };

}