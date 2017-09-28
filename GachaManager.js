function GachaManager() {

 DefaultManager.call(this, [INV]);

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

  var chestData = this.Containers[chestId];

  var ret = [];

  for (var a = 0; a < chestData.length; a++) {

   var reward = this.SpinTable(chestData[a]);
   if (reward !== null) {
    this.ClaimReward(reward);
   }
   ret.push(this.SpinTable(chestData[a]));
  }

  this.PushNow();

  return ret;
 };

 this.ClaimReward = function (itemData) {
  var id = itemData.item;
  var parts = id.split(".");
  var inventory;
  switch (parts[0]) {

   case "currency":
    if (parts[1] === "diamond") {
     Currency.Add(DIAMOND, itemData.qty);
    }
    break;

   case "piece":
   case "merc":
   case "mat":
    inventory = this.GetInvetory();
    if (id in inventory) {
     inventory[id] += itemData.qty;
    }
    else {
     inventory[id] = itemData.qty;
    }
    break;
  }
 };

 this.GetInvetory = function () {

  if (!(INV in this.GetData())) {
   this.GetData()[INV] = {};
  }
  return this.GetData()[INV];
 };

 this.SpinTable = function (tableId) {

  if (!(tableId in this.DropTable)) {
   log.error("invalid table: " + tableId);
  }

  var itemList = this.DropTable[tableId];

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
   total = cumulative[a];
  }

  var random = Math.randomBetween(1, total);

  var index = 0;

  for (a = 0; a < cumulative.length; a++) {
   if (random <= cumulative[a]) {
    index = a;
    break;
   }
  }

  if ("item" in itemList[index]) {
   var ret = {};
   ret.item = itemList[index].item;
   ret.qty = Math.randomBetween(itemList[index].range[0], itemList[index].range[1]);
   return ret;
  }
  else if ("table" in itemList[index]) {
   return this.SpinTable(itemList[index].table);
  }
  return null;
 };

}