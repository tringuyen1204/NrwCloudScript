function BattleHandler() {

 this.Run = function (args) {
  switch (args.command) {
   case CMD_START_BATTLE:
    return this.StartBattle(args);
   case CMD_END_BATTLE:
    return this.EndBattle(args);
  }
  return false;
 };

 this.StartBattle = function (args) {
 };

 this.EndBattle = function (args) {
 };

}
