/**
 *
 * @param {String} playerId = null
 * @constructor
 */
function UserData(playerId) {

    if (playerId === null || playerId === undefined) {
        this.PlayerId = currentPlayerId;
    }
    else {
        this.PlayerId = playerId;
    }

    this.Data = {};

    /**
     *
     * @param {Array} keys
     * @constructor
     */
    this.Load = function (keys) {

        if (keys === null || keys === undefined) {
            return;
        }

        var requestKey = [];

        var a;

        for (a = 0; a < keys.length; a++) {
            if (keys[a] in this.Data) {
                continue;
            }
            requestKey.push(keys[a]);
        }

        var rawData = server.GetUserReadOnlyData({
            PlayFabId: this.PlayerId,
            Keys: requestKey
        });

        for (a = 0; a < requestKey.length; a++) {
            if (requestKey[a] in rawData) {
                this.Data[requestKey[a]] = JSON.parse(rawData[requestKey[a]].Value);
            }
            else {
                this.Data[requestKey[a]] = {};
            }
        }
    };

    this.Push = function () {

        var writeData = {};

        var canPush = false;

        for (var key in this.Data) {
            if (this.Data.hasOwnProperty(key)) {
                writeData[key] = JSON.stringify(this.Data[key]);
                canPush = true;
            }
        }

        if (canPush) {
            server.UpdateUserReadOnlyData({
                PlayFabId: this.PlayerId,
                Data: writeData,
                Permission: "public"
            });
        }
        else {
            log.info("nothing to push");
        }
    }
}

ServerData = {};

/**
 *
 * @param playerId
 * @returns {UserData}
 * @constructor
 */
ServerData.Get = function (playerId) {
    if (!(playerId in ServerData)) {
        ServerData[playerId] = new UserData(playerId);
    }
    return ServerData[playerId];
};