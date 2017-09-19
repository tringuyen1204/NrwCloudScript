function RaidManager(AttackerId, DefenderId) {
 this.Ids = {};
 this.Ids[ATK] = AttackerId;
 this.Ids[DEF] = DefenderId;

 this.Data = {};
 this.Data[ATK] = UserData.Get([RES, LOGS], AttackerId);
 this.Data[DEF] = UserData.Get([RES, LOGS, BUILDING], DefenderId);

 this.Run = function (args) {
  args = this.FormatData(args);

  var atkHandler = new AttackerHandler(this.Ids[ATK]);
  var defHandler = new DefenceHandler(this.Ids[DEF]);

  if (atkHandler.Run(args) && defHandler.Run(args)) {
   UserData.Update(this.Data[ATK], this.Ids[ATK]);
   UserData.Update(this.Data[DEF], this.Ids[DEF]);
  }
 };

 this.FormatData = function (args) {

  if (!args.hasOwnProperty("date")) {
   args.date = ServerTime.Now();
  }
  args.ScoutData = this.Data[ATK][LOGS].ScoutData;
  return args;
 }
}