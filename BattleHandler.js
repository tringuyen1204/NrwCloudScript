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

  var noError = true;

  if (!(MERC in args)) {
   return false;
  }

  for (var a = 0; a < args[MERC].length; a++) {
   if (!this.UseMerc(args[MERC][a])) {
    noError = false;
    break;
   }
  }

  return noError;
 };

 this.UseMerc = function (mercId) {

  var inventory = this.Data[INV];
  if (inventory === null || inventory === undefined) {
   log.error("inventory null");
   return false;
  }

  if (!(mercId in inventory) || inventory[mercId] <= 0) {
   log.error("inventory doesn't contain this merc: " + mercId);
   return false;
  }
  inventory[mercId]--;

  if (inventory[mercId] == 0) {
   delete inventory[mercId];
  }
  return true;
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
 this.base = new BattleHandler();

 this.playerId = playerId;
 this.type = ATK;

 this.StartBattle = function (args) {

  if (this.type === ATK) {
   if (!this.base.StartBattle.call(this, args)) {
    return false;
   }
  }

  if (!(this.type in this.Data[LOGS])) {
   this.Data[LOGS][this.type] = {};
  }

  if (this.type === ATK) {
   this.Data[LOGS].ScoutData.LastLogId = String(args.date);
  }

  var scoutData = args.ScoutData;

  args.LastLogId = String(args.date);
  this.UpdateBattleLog(args);

  var changes = GloryPoint.GetChanges(false, scoutData.AttackerGp - scoutData.DefenderGp);

  var log = this.Data[LOGS][this.type][args.LastLogId];
  log.AtkGpChange = changes[ATK];
  log.DefGpChange = changes[DEF];

  if (this.type === ATK) {
   GloryPoint.Set(scoutData.AttackerGp + log.AtkGpChange, scoutData.AttackerId);
  }
  else {
   GloryPoint.Set(scoutData.DefenderGp + log.DefGpChange, scoutData.DefenderId);
  }
  return true;
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

  var logId = args.LastLogId;

  this.Data[LOGS][this.type][logId] = log;

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

  var changes = GloryPoint.GetChanges(args.result, scoutData.AttackerGp - scoutData.DefenderGp);
  GloryPoint.Set(scoutData.AttackerGp + Math.floor(changes[ATK]), this.playerId);

  if ("Casualties" in args) {
   var bMan = new BuildManager(this.playerId, this.Data[RES]);
   bMan.ApplyCasualties(args);
  }

  this.UpdateResultLog(args);

  return true;
 };

 this.UpdateResultLog = function (args) {
  var logId = scoutData.LastLogId;
  var log = this.Data[LOGS][this.type][logId];

  if (args.result) {
   log.Result = "Attacker Win";
  }
  else {
   log.Result = "Defender Win";
  }

  if ("Casualties" in args) {
   log.Casualties = args.Casualties;
  }
 }
}

AttackerHandler.prototype = Object.create(BattleHandler.prototype);

function DefenceHandler(playerId) {

 AttackerHandler.call(this, playerId);
 this.type = DEF;

 this.EndBattle = function (args) {

  var scoutData = args.ScoutData;

  if (args.result) {
   var b = new BuildManager(this.playerId, this.Data[BUILDING]);
   b.ApplyRaid(args);

   var r = new ResManager(this.playerId, this.Data[RES]);
   r.ApplyRaid(args);
  }

  var changes = GloryPoint.GetChanges(args.result, scoutData.AttackerGp - scoutData.DefenderGp);
  GloryPoint.Set(scoutData.DefenderGp + Math.floor(changes[DEF]), this.playerId);

  this.UpdateResultLog(args);

  return true;
 }
}

DefenceHandler.prototype = Object.create(AttackerHandler.prototype);
