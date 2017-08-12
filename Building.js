
"use strict";
class Building {

  contructor(type, index){
    this.buildingId = type + index;
    var rawData = PlayFab.GetUserReadOnlyData( [this.buildingId] );

    this.data = {
      "level":0,
      "completedDate":0,
      "upgrading":false
    }

    if ( this.buildingId in rawData ){
      this.data = rawData[this.buildingId];
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
    return Date.now();
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
