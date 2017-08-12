function UserData(key){

  this.key = key;

  this.Pull = function(){
    var rawData = server.GetUserReadOnlyData({
        "PlayFabId":currentPlayerId,
        "Keys": [this.key]
    }).Data;

    if ( key in rawData ){
      this.data = JSON.parse(rawData[this.key].Value);
    }
  }

  this.Pull();
  if (this.data == null){
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
