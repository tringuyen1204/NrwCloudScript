function UserData(Key){
  this.Key = Key;

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
