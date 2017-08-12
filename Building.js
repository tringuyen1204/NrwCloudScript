function Building(type, index) {
  this.buildingId = type + index;

  var rawData = server.GetUserReadOnlyData({
      "PlayFabId":currentPlayerId,
      "Keys": [this.buildingId]
  }).Data;

  if ( this.buildingId in rawData ){
    this.data = rawData[this.buildingId];
  }
  else {
    // default data
    this.data = {
      "level":0,
      "completedDate":0,
      "upgrading":false
    }
  }

  this.IsCompleted = function() {
    return this.data.completedDate <= this.ServerTime();
  }

  this.CurrentLevelData = function(){
    if ( !("_curLvlData" in this) ) {

    }
  }

  this.NextLevelData = function() {
    if ( !("_nextLvlData" in this) ) {
    }
  }

  this.ServerTime = function(){
    return Date.now();
  }

  this.StartUpgrade = function(){
    if( this.upgrading ){
      log.error(type + index + " is already upgrading!");
    }

    this.data.level += 1;
    this.data.completedDate = this.ServerTime() + 100000;
    this.data.upgrading = true;

    var newData = {};
    newData[this.buildingId] = JSON.stringify(this.data);

    server.UpdateUserReadOnlyData({
      "PlayFabId":currentPlayerId,
      "Data":newData
    });
  }

  this.CompleteUpgrade = function(){
  }
}
