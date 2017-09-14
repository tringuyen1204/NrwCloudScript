function UserData(Key, playerId) {

    this.PlayerId = (playerId !== undefined && playerId !== null) ? playerId : currentPlayerId;
    this.Key = Key;

    var rawData = server.GetUserReadOnlyData({
        "PlayFabId": this.PlayerId,
        "Keys": [this.Key]
    }).Data;

    if (rawData.hasOwnProperty(this.Key)) {
        this.Data = JSON.parse(rawData[this.Key].Value);
    }
    else {
        this.Data = {};
        log.error("can't load data key = " + this.Key + " of player id = " + this.PlayerId);
    }

    this.Push = function(){
        var newData = {};
        newData[this.Key] = JSON.stringify(this.Data);

        server.UpdateUserReadOnlyData({
            "PlayFabId": this.PlayerId,
            "Data":newData,
            "Permission":"public"
        });
    };

    /**
     * @returns {data}
     */
    this.Get = function (id) {
        if (!this.Data.hasOwnProperty(id)) {
            return null;
        }
        return this.Data[id];
    };

    /**
     * @returns {number}
     */
    this.GetDate = function (args) {
        if (args === null || args === undefined || !args.hasOwnProperty("date")) {
            return Date.now();
        }
        return Number(args.date);
    };
}
