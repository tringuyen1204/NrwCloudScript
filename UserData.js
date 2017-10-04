/**
 *
 * @param {String} pId = null
 * @constructor
 */
function UserData(pId) {

    if (pId === null || pId === undefined) {
        this.PlayerId = currentPlayerId;
    }
    else {
        this.PlayerId = pId;
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

        var reqKeys = [];

        var a;

        for (a = 0; a < keys.length; a++) {
            if (keys[a] in this.Data) {
                continue;
            }
            reqKeys.push(keys[a]);
        }

        if (reqKeys.length > 0) {

            var rawData = server.GetUserReadOnlyData({
                PlayFabId: this.PlayerId,
                Keys: reqKeys
            }).Data;

            for (a = 0; a < reqKeys.length; a++) {
                if (reqKeys[a] in rawData) {
                    this.Data[reqKeys[a]] = JSON.parse(rawData[reqKeys[a]].Value);
                }
                else {
                    this.Data[reqKeys[a]] = {};
                }
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

var ServerData = {};

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