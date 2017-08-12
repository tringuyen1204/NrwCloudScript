handlers.Build = function(args){
  ConstructBuilding("castle", 0);
  return 1;
}

function ConstructBuilding(buildingType, index){

  var buildingData = PfHelper.GetReadOnlyData([buildingType]);

  var curLv = 0;
  var allBuildings;

  if (GetUserDataResult.Data[buildingType] != null){
    allBuildings = JSON.parse(buildingData[buildingType].Value);
    if (allBuildings.length > index){
      curLv = allBuildings[index].lvl;
    }
  }
  else {
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
