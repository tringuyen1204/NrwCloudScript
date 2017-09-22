var Gacha = {};

Gacha.OpenChest = function (args) {

 if (!("chestId" in args)) {
  log.error("chestId is null");
  return;
 }

 var chestId = args["chestId"];

 var rawData = server.GetTitleInternalData([
  "DropTable",
  "Containers"
 ]).Data;

 var DropTable = JSON.parse(rawData["DropTable"]);
 var Containers = JSON.parse(rawData["Containers"]);

 if (!(chestId in Containers)) {
  log.error("containers don't have this chest");
 }

 var chestData = Containers[chestId].Data;

 for (var a = 0; a < chestData.length; a++) {
  log.info(chestData[a]);
 }

};