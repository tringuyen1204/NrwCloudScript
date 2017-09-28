function ResManager(playerId, loadedData) {

 if (loadedData === null || loadedData === undefined) {
  DefaultManager.call(this, [RES], playerId);
 }
 else {
  DefaultManager.call(this, [], playerId);
  this.GetData()[RES] = loadedData;
 }

 this.ValueOf = function (code) {
  if (this.GetData()[RES][code] === null) {
   this.GetData()[RES][code] = {
    "Value": 0,
    "Max": 0
   }
  }
  return this.GetData()[RES][code].Value;
 };

 this.MaxOf = function (code) {
  if (this.GetData()[RES][code] === null) {
   this.GetData()[RES][code] = {
    "Value": 0,
    "Max": 0
   }
  }
  return this.GetData()[RES][code].Max;
 };

 this.Change = function (code, qty) {
  if (this.ValueOf(code) + qty < 0) {
   this.GetData()[RES][code].Value = 0;
  }
  else if (this.ValueOf(code) + qty > this.MaxOf(code)) {
   this.GetData()[RES][code].Value = this.MaxOf(code);
  }
  else {
   this.GetData()[RES][code].Value += qty;
  }
 };

 this.SetMax = function (code, newMax) {
  this.GetData()[RES][code].Max = newMax;
  this.Push();
 };

 this.ApplyRaid = function (args) {
  this.Change(GOLD, Math.floor(-this.ValueOf(GOLD) * args.rate * 0.25));
  this.Change(FOOD, Math.floor(-this.ValueOf(FOOD) * args.rate * 0.25));
 };
}

ResManager.prototype = Object.create(DefaultManager.prototype);
