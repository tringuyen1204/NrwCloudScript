var UserData = {};

UserData.Update = function (data, playerId) {
    playerId = UserData.CheckId(playerId);

    var writeData = {};

    var canPush = false;

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            writeData[key] = JSON.stringify(data[key]);
            canPush = true;
        }
    }

    if (canPush) {
        server.UpdateUserReadOnlyData({
            PlayFabId: playerId,
            Data: writeData,
            Permission: "public"
        });
    }
    else {
        log.info("nothing to push");
    }
};

UserData.Get = function (keys, playerId) {

    playerId = UserData.CheckId(playerId);

    var ret = {};

    var rawData = server.GetUserReadOnlyData({
        PlayFabId: playerId,
        Keys: keys
    }).Data;

    for (var a = 0; a < keys.length; a++) {
        if (keys[a] in rawData) {
            ret[keys[a]] = JSON.parse(rawData[keys[a]].Value);
        }
        else {
            ret[keys[a]] = {};
        }
    }
    return ret;
};

UserData.CheckId = function (id) {
    if (id === null || id === undefined) {
        return currentPlayerId;
    }
    return id;
};
