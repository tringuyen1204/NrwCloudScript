function UpdateUserData(object){
  var newData = {};
  newData[object.key] = JSON.stringify(object.data);

  server.UpdateUserReadOnlyData({
    "PlayFabId":currentPlayerId,
    "Data":newData,
    "Permission":"public"
  });
}

function GetUserData(key){
  var rawData = server.GetUserReadOnlyData({
      "PlayFabId":currentPlayerId,
      "Keys": [key]
  }).Data;

  if ( key in rawData ){
    return JSON.parse(rawData[key].Value);
  }
  else {
    return null;
  }
}

function UserData(key){

  this.Pull = function(){
    var rawData = server.GetUserReadOnlyData({
        "PlayFabId":currentPlayerId,
        "Keys": [this.key]
    }).Data;

    if ( key in rawData ){
      this.data = JSON.parse(rawData[this.key].Value);
    }
  }

  this.key = key;
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
