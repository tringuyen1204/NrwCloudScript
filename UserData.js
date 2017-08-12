function UserData(Key){
  this.Key = Key;

  this.ServerTime = function(){
    return Date.now();
  }

  var rawData = server.GetUserReadOnlyData({
      "PlayFabId":currentPlayerId,
      "Keys": [this.Key]
  }).Data;

  if ( Key in rawData ){
    this.Data = JSON.parse(rawData[this.Key].Value);
  }
  else {
    this.Data = {};
  }
  this.Push = function(){
    var newData = {};
    newData[this.Key] = JSON.stringify(this.Data);

    server.UpdateUserReadOnlyData({
      "PlayFabId":currentPlayerId,
      "Data":newData,
      "Permission":"public"
    });
  }
}

function GetMultipleUserData(Keys){
  var rawData = server.GetUserReadOnlyData({
    "PlayFabId":currentPlayerId,
    "Keys": Keys
  }).Data;

  var index = 0;
  var ret = [];

  for (var key in rawData) {
    if (rawData.hasOwnProperty(key)) {
      ret[index] = {
        "Key":key,
        "Data": JSON.parse(rawData[key].Value)
      };
      index++;
    }
  }

  return ret;
}
