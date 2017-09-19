function ResManager(playerId, loadedData) {

 if (loadedData === null || loadedData === undefined) {
  DataManager.call(this, [RES], playerId);
 }
 else {
  DataManager.call(this, [], playerId);
  this.Data[RES] = loadedData;
 }

 this.ValueOf = function (code) {
  if (this.Data[RES][code] === null) {
   this.Data[RES][code] = {
    "Value": 0,
    "Max": 0
   }
  }
  return this.Data[RES][code].Value;
 };

 this.MaxOf = function (code) {
  if (this.Data[RES][code] === null) {
   this.Data[RES][code] = {
    "Value": 0,
    "Max": 0
   }
  }
  return this.Data[RES][code].Max;
 };

 this.Change = function (code, qty) {
  if (this.ValueOf(code) + qty < 0) {
   this.Data[RES][code].Value = 0;
  }
  else if (this.ValueOf(code) + qty > this.MaxOf(code)) {
   this.Data[RES][code].Value = this.MaxOf(code);
  }
  else {
   this.Data[RES][code].Value += qty;
  }
 };

 this.SetMax = function (code, newMax) {
  this.Data[RES][code].Max = newMax;
  this.Push();
 };

 this.ApplyRaid = function (args) {
  this.Change(GOLD, Math.floor(-this.ValueOf(GOLD) * args.rate * 0.25));
  this.Change(FOOD, Math.floor(-this.ValueOf(FOOD) * args.rate * 0.25));
 };
}

ResManager.prototype = Object.create(DataManager.prototype);
