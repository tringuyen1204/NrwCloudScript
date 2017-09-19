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

 var rawData = server.GetUserReadOnlyData({
  PlayFabId: playerId,
  Keys: keys
 }).Data;

 for (var a = 0; a < keys.length; a++) {
  if (keys[a] in rawData) {
   ret[keys[a]] = JSON.parse(rawData[keys[a]]);
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