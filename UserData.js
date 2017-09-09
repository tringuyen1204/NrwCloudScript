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

    /**
     * @returns {number}
     */
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

    /**
     * @returns {data}
     */
    this.Get = function (id) {
        if (this.Data[id] === null) {
            return null;
        }
        return this.Data[id];
    }
}
