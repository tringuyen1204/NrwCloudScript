function UserData(Key){
    this.Key = Key;

    var rawData = server.GetUserReadOnlyData({
        "PlayFabId":currentPlayerId,
        "Keys": [this.Key]
    }).Data;

    if ( Key in rawData ){
        this.Data = JSON.parse( rawData[this.Key].Value );
    }
    else {
        this.Data = {};
    }

    this.ServerTime = function() {
        return Date.now();
    };

    this.Push = function(){
        var newData = {};
        newData[this.Key] = JSON.stringify(this.Data);

        server.UpdateUserReadOnlyData({
            "PlayFabId":currentPlayerId,
            "Data":newData,
            "Permission":"public"
        });
    };

    this.Get = function (id) {

        if ( this.Data[id] == null ) {
            return null;
        }
        return this.Data[id];
    }
}

// unsafe function
function PushUserData(key, data){
    var newData = {};
    newData[key] = JSON.stringify(data);

    server.UpdateUserReadOnlyData({
        "PlayFabId":currentPlayerId,
        "Data":newData,
        "Permission":"public"
    });
}

function GetMultipleUserData(Keys){
    var rawData = server.GetUserReadOnlyData({
        "PlayFabId":currentPlayerId,
        "Keys": Keys
    }).Data;

    var ret = {};

    for (var key in rawData) {
        if (rawData.hasOwnProperty(key)) {
            ret[key] = {
                "Key": key,
                "Data": JSON.parse(rawData[key].Value)
            };
        }
    }

    return ret;
}