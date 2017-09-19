function DataManager(keys, playerId) {
 this.PlayerId = (playerId !== undefined && playerId !== null) ? playerId : currentPlayerId;
 this.Keys = keys;

 this.Data = UserData.Get(keys, this.PlayerId);

 this.Push = function (args) {
  this.PushNow();
 };

 this.PushNow = function () {
  UserData.Update(this.Data, this.PlayerId);
 };

 this.FormatData = function (args) {
  if (args === null || args === undefined) {
   args = {};
  }
  if (!args.hasOwnProperty("date")) {
   args.date = ServerTime.Now();
  }
  if (!args.hasOwnProperty("id")) {
   args.id = "0";
  }
  return args;
 };

 this.Run = function (args) {
  args = this.FormatData(args);
  var handler = this.GetHandler(args);

  if (handler !== null && handler.Run(args)) {
   this.Push(args);
  }

  return this.Data;
 };

 this.GetHandler = function (args) {
  var handler = new DataHandler(type);
  handler.Data = this.Data;
  return handler;
 };
}