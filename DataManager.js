DataManager = function (Key, playerId) {
    this.Handlers = {};
    this.PlayerId = (playerId !== undefined && playerId !== null) ? playerId : PLAYER_ID;
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
};

DataManager.prototype.Push = function (args) {
    this.PushNow();
};

DataManager.prototype.PushNow = function () {
    var newData = {};
    newData[this.Key] = JSON.stringify(this.Data);

    server.UpdateUserReadOnlyData({
        "PlayFabId": this.PlayerId,
        "Data": newData,
        "Permission": "public"
    });
};

DataManager.prototype.Get = function (id) {
    if (!this.Data.hasOwnProperty(id)) {
        return null;
    }
    return this.Data[id];
};

DataManager.prototype.FormatData = function (args) {
    if (args === null || args === undefined) {
        args = {};
    }
    if (!args.hasOwnProperty("date")) {
        args.date = ServerTime.Now();
    }
    if (!args.hasOwnProperty("id")) {
        args.id = "0";
    }
    return args;
};

DataManager.prototype.Execute = function (args) {
    args = this.FormatData(args);
    var handler = this.GetHandler(args);
    if (handler.Execute(args)) {
        this.Push(args);
    }
};

DataManager.prototype.GetHandler = function (args) {
    var handlers = this.Handlers;
    var type = args.type;

    if (handlers.hasOwnProperty(type)) {
        handlers[type] = new DataHandler(type);
        handlers[type].Data = this.Data;
    }
    return handlers[type];
};
