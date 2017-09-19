var Converter = {};

Converter.TimeToDiamond = function (milisec) {
 if (milisec <= 0) {
  return 0;
 }

 var hours = milisec / HOUR;
 var ret = 25.18375 * Math.pow(hours, 0.7513);

 if (ret > Math.floor(ret))
  ret = ret + 1;

 return ret;
};

Converter.GoldFoodToDiamond = function (qty) {
 if (qty <= 0)
  return 0;
 var ret = Math.pow(6, Math.log(qty / 100) / Math.log(10));
 if (ret < 1)
  ret = 1;
 return Math.floor(ret);
};

var Currency = {};

Currency.Spend = function (code, qty) {
 var vcBalances = server.GetUserInventory({
  "PlayFabId": currentPlayerId
 }).VirtualCurrency;

 if (vcBalances !== null
  && vcBalances.hasOwnProperty(code)
  && vcBalances[code] >= qty) {
  ChangeCurrency(vcBalances, code, -qty);
  return true;
 }
 return false;
};

function ChangeCurrency(vcBalances, code, qty) {
 if (vcBalances !== null
  && vcBalances.hasOwnProperty(code)
  && (vcBalances[code] + qty >= 0)) {
  vcBalances[code] += qty;
 }

 if (qty > 0) {
  server.AddUserVirtualCurrency({
   "PlayFabId": currentPlayerId,
   "VirtualCurrency": code,
   "Amount": Math.abs(qty)
  });
 }
 else {
  server.SubtractUserVirtualCurrency({
   "PlayFabId": currentPlayerId,
   "VirtualCurrency": code,
   "Amount": Math.abs(qty)
  });
 }
}

Math.randomBetween = function (min, max) {
 return Math.floor(Math.random() * (max - min + 1) + min);
};

var ServerTime = {
 deltaTime: 0
};

ServerTime.Now = function () {
 return Date.now() + ServerTime.deltaTime;
};


var UserData = {};

UserData.Update = function (data, playerId) {
 playerId = UserData.CheckId(playerId);

 var writeData = {};

 for (var key in data) {
  if (data.hasOwnProperty(key)) {
   writeData[key] = JSON.parse(data[key]);
  }
 }

 server.UpdateUserReadOnlyData({
  PlayFabId: playerId,
  Data: writeData,
  Permission: "public"
 });
};

UserData.Get = function (keys, playerId) {

 playerId = UserData.CheckId(playerId);

 var ret = {};

 var rawData = server.GetUserReadyOnlyData({
  PlayFabId: playerId,
  Keys: keys
 }).Data;

 for (var a = 0; a < keys.length; a++) {
  if (keys[a] in rawData) {
   ret[keys[a]] = JSON.parse(rawData[a]);
  }
  else {
   ret[keys[a]] = {};
  }
 }
 return ret;
};

UserData.CheckId = function (id) {
 if (id === null || id === undefined) {
  return currentPlayerId;
 }
 return id;
};