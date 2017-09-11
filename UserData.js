function UserData(Key) {
    this.Key = Key;

    var id = currentPlayerId;

    var rawData = server.GetUserReadOnlyData({
        "PlayFabId": id,
        "Keys": [this.Key]
    }).Data;

    if (rawData.hasOwnProperty(this.Key)) {
        log.info(rawData[this.Key].Value);
        this.Data = JSON.parse(rawData[this.Key].Value);
    }
    else {
        this.Data = {};
    }

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
