function UserData(Key, playerId) {

    this.PlayerId = (playerId !== undefined && playerId !== null) ? playerId : currentPlayerId;
    this.Key = Key;

    var id = currentPlayerId;

    var rawData = server.GetUserReadOnlyData({
        "PlayFabId": this.PlayerId,
        "Keys": [this.Key]
    }).Data;

    if (rawData.hasOwnProperty(this.Key)) {
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
