
"use strict";
class Building {
  contructor(type, index){
    this.buildingId = type + index;
    var rawData = PlayFab.GetUserReadOnlyData( [this.buildingId] );

    if ( this.buildingId in rawData ){
      this.data = rawData[this.buildingId];
    }
    else {
      this.data = {
        "level":0,
        "completedDate":0,
        "upgrading":false
      }
    }
  }

  IsCompleted() {
    return this.data.completedDate <= this.ServerTime();
  }

  CurrentLevelData(){
    if ( !("_curLvlData" in this) ) {

    }
  }

  NextLevelData() {
    if ( !("_nextLvlData" in this) ) {
    }
  }

  ServerTime(){
    if ( !("_time" in this) ) {
      this._time = new Date(server.GetTime().Time).getTime();
    }
    return this._time;
  }

  StartUpgrade(){
    if( this.upgrading ){
      log.error(type + index + " is already upgrading!");
    }

    this.data.completedDate = this.ServerTime() + 100000;
    this.data.upgrading = true;

    var newData = {};
    newData[this.buildingId] = JSON.stringify(this.data);

    PlayFab.UpdateReadOnlyData(newData);
  }

  CompleteUpgrade(){
  }
}
