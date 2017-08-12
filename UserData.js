function UserData(key){
  this.Key = key;

  var rawData = server.GetUserReadOnlyData({
      "PlayFabId":currentPlayerId,
      "Keys": [this.key]
  }).Data;

  if ( key in rawData ){
    this.Data = JSON.parse(rawData[this.key].Value);
  }
  else {
    this.Data = {};
  }

  this.Push = function(){
    var newData = {};
    newData[this.key] = JSON.stringify(this.Data);

    server.UpdateUserReadOnlyData({
      "PlayFabId":currentPlayerId,
      "Data":newData,
      "Permission":"public"
    });
  }
}
