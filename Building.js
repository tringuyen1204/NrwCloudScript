handlers.Build = function(args){
  Building.Construct("castle", 0);
  return 1;
}

function Building(){
  this.Construct = function(buildingType, index){
    var buildingData = PfHelper.GetReadOnlyData([buildingType]);

    var curLv = 0;

    // all building data of this building type
    var allBuildings;

    if (GetUserDataResult.Data[buildingType] != null){
      allBuildings = JSON.parse(buildingData[buildingType].Value);
      if (allBuildings.length > index){
        curLv = allBuildings[index].lvl;
      }
    }
    else {
      // the first building of this type has not been built
      // create new array
      allBuildings = [];
    }

    curLv += 1;

    var newBuildingData = {
      "lvl":curLv,
      "updateTime":10
    }

    allBuildings[index] = newBuildingData;

    var newData = {};
    newData[buildingType] = JSON.stringify(allBuildings);

    PfHelper.UpdateReadOnlyData(newData);
  }
}
