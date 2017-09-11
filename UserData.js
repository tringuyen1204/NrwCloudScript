function UserData(Key) {
    this.Key = Key;

    var id = currentPlayerId;

    var rawData = server.GetUserReadOnlyData({
        "PlayFabId": id,
        "Keys": [this.Key]
    }).Data;

    var key;

    log.info(rawData[key].Value);

    if (key in rawData) {
        this.Data = JSON.parse(rawData[key].Value);

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
