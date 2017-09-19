function BattleHandler() {
 this.Run = function (args) {
  switch (args.command) {
   case CMD_START_BATTLE:
    return this.StartBattle(args);
   case CMD_UPDATE_BATTLE:
    return this.UpdateBattle(args);
   case CMD_END_BATTLE:
    return this.EndBattle(args);
  }
  return false;
 };

 this.StartBattle = function (args) {
  return false;
 };

 this.EndBattle = function (args) {
  return false;
 };

 this.UpdateBattle = function (args) {
  return false;
 };
}

function AttackerHandler(playerId) {

 BattleHandler.call(this);

 this.playerId = playerId;
 this.type = ATK;

 this.StartBattle = function (args) {

  if (!(this.type in this.Data[LOGS])) {
   this.Data[LOGS][this.type] = {};
  }

  if (this.type === ATK) {
   this.Data[LOGS].ScoutData.LastLogId = String(args.date);
  }

  args.LastLogId = String(args.date);
  return this.UpdateBattleLog(args);
 };

 this.UpdateBattle = function (args) {
  return this.UpdateBattleLog(args);
 };

 this.UpdateBattleLog = function (args) {

  var log = {
   Result: "Unresolved"
  };

  log.ScoutData = args.ScoutData;
  log.LastActiveDate = args.date;

  this.Data[LOGS][this.type][args.LastLogId] = log;

  if (this.type === DEF) {
   this.Data[LOGS].LastDefendDate = args.date;
  }
  return true;
 };

 this.EndBattle = function (args) {
  if (args.result) {

   var resMan = new ResManager(this.playerId, this.Data[RES]);
   var scoutData = args.ScoutData;

   resMan.Change(GOLD, scoutData[GOLD] + scoutData["ProducedGold"]);
   resMan.Change(FOOD, scoutData[FOOD] + scoutData["ProducedFood"]);
  }

  var changes = GloryPoint.GetChanges(args.result, args.AttackerGp - args.DefenderGp);
  GloryPoint.Set(args.AttackerGp + Math.floor(changes[ATK]), this.playerId);

  var logId = args.ScoutData.LastLogId;
  var log = this.Data[this.type][logId];

  if (args.result) {
   log.Result = "Attacker Win";
  }
  else {
   log.Result = "Defender Win";
  }

  return true;
 }
}

AttackerHandler.prototype = Object.create(BattleHandler.prototype);

function DefenceHandler(playerId) {

 AttackerHandler.call(this, playerId);
 this.type = DEF;

 this.EndBattle = function (args) {

  if (args.result) {
   var b = new BuildManager(this.playerId, this.Data[BUILDING]);
   b.ApplyRaid(args);

   var r = new ResManager(this.playerId, this.Data[RES]);
   r.ApplyRaid(args);
  }

  var changes = GloryPoint.GetChanges(args.result, args.AttackerGp - args.DefenderGp);
  GloryPoint.Set(args.DefenderGp + Math.floor(changes[DEF]), this.playerId);

  var logId = args.ScoutData.LastLogId;
  var log = this.Data[this.type][logId];

  if (args.result) {
   log.Result = "Attacker Win";
  }
  else {
   log.Result = "Defender Win";
  }

  return true;
 }
}

DefenceHandler.prototype = Object.create(AttackerHandler.prototype);