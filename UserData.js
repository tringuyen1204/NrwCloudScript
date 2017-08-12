function UserData(key){
  this.key = key;

  var rawData = server.GetUserReadOnlyData({
      "PlayFabId":currentPlayerId,
      "Keys": [this.key]
  }).Data;

  if ( key in rawData ){
    this.data = JSON.parse(rawData[this.key].Value);
  }
  else {
    this.data = {};
  }

  this.Push = function(){
    var newData = {};
    newData[this.key] = JSON.stringify(this.data);

    server.UpdateUserReadOnlyData({
      "PlayFabId":currentPlayerId,
      "Data":newData,
      "Permission":"public"
    });
  }
}
