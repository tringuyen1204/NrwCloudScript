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
    return JSON.parse(rawData[this.key].data);
  }
  else {
    return null;
  }
}
