function RaidHandler() {

 this.StartBattle = function (args) {
  var atkLog = new BattleLog();
  var defLog = new BattleLog(args.target);

  var atkId = currentPlayerId;
  var defId = args.target;

  var atkBoard = server.GetLeaderboardAroundUser({
   "StatisticName": "GloryPoint",
   "PlayFabId": atkId,
   "MaxResultsCount": 1
  });

  var defBoard = server.GetLeaderboardAroundUser({
   "StatisticName": "GloryPoint",
   "PlayFabId": defId,
   "MaxResultsCount": 1
  });

  var atkGp = atkBoard.Leaderboard[0].StatValue;
  var defGp = defBoard.Leaderboard[0].StatValue;

  var data = {
   Attacker: currentPlayerId,
   Target: args.target,
   AtkGp: atkGp,
   DefGp: defGp,
   State: "Begin",
   LastActiveDate: args.date
  };

  atkLog.Update("Attack", String(args.date), data);
  defLog.Update("Defence", String(args.date), data);
 };

 this.EndBattle = function (args) {

  if (!args.hasOwnProperty("result")) {
   args.result = Math.random() > 0.4;
   args.rate = 0.5;
  }

  if (args.result) {
   log.info("Attacker win!");

   var b = new BuildManager(args.target);
   b.ApplyRaid(args);

   var r = new ResHandler(args.target);
   r.ApplyRaid(args);

   var resMan = new ResHandler();
   var raidData;

   var rawData = server.GetUserReadOnlyData({
    "PlayFabId": currentPlayerId,
    "Keys": ["Raid"]
   }).Data;

   if (rawData.hasOwnProperty("Raid")) {
    raidData = JSON.parse(rawData["Raid"].Value);
   }

   resMan.Change(GOLD, raidData[GOLD] + raidData["ProducedGold"]);
   resMan.Change(FOOD, raidData[FOOD] + raidData["ProducedFood"]);
   resMan.Push();
  }
  else {
   log.info("Attacker lose");
  }

  this.ApplyResult(result);
 };

 this.ApplyResult = function (args) {
  var atkId = currentPlayerId;
  var defId = args.target;
  var result = args.result;

  var atkBoard = server.GetLeaderboardAroundUser({
   "StatisticName": "GloryPoint",
   "PlayFabId": atkId,
   "MaxResultsCount": 1
  });

  var defBoard = server.GetLeaderboardAroundUser({
   "StatisticName": "GloryPoint",
   "PlayFabId": defId,
   "MaxResultsCount": 1
  });

  var atkGp = atkBoard.Leaderboard[0].StatValue;
  var defGp = defBoard.Leaderboard[0].StatValue;

  var deltaGp = atkGp - defGp;

  var a, b;
  var limit;

  if (result) {
   a = -0.0794;
   b = 29.35838;
   limit = 59;
  }
  else {
   a = 0.0531;
   b = 19.60453;
   limit = 39;
  }

  // atk
  var atkGpMod = a * deltaGp + b;

  if (atkGpMod < 0) {
   atkGpMod = 0;
  }
  else if (atkGpMod > limit) {
   atkGpMod = limit;
  }

  // def
  var defGpMod = a * -deltaGp + b;

  if (defGpMod < 0) {
   defGpMod = 0;
  }
  else if (defGpMod > limit) {
   defGpMod = limit;
  }

  if (result) {
   defGpMod = -defGpMod;
  }
  else {
   atkGpMod = -atkGpMod;
  }

  GloryPoint.Set(atkGp + Math.floor(atkGpMod), atkId);
  GloryPoint.Set(defGp + Math.floor(defGpMod), defId);
 };
}

RaidHandler.prototype = Object.create(BattleHandler.prototype);

