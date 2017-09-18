function DataManager(Key, playerId) {
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

    this.Push = function (args) {
        this.PushNow();
    };

    this.PushNow = function () {
        var newData = {};
        newData[this.Key] = JSON.stringify(this.Data);

        server.UpdateUserReadOnlyData({
            "PlayFabId": this.PlayerId,
            "Data": newData,
            "Permission": "public"
        });
    };

    this.Get = function (id) {
        if (!this.Data.hasOwnProperty(id)) {
            return null;
        }
        return this.Data[id];
    };

    this.FormatData = function (args) {
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

    this.Run = function (args) {
        args = this.FormatData(args);
        var handler = this.GetHandler(args);

        if (handler !== null && handler.Run(args)) {
            this.Push(args);
        }

        return this.Data;
    };

    this.GetHandler = function (args) {
        var handlers = this.Handlers;
        var type = args.type;

        if (handlers.hasOwnProperty(type)) {
            handlers[type] = new DataHandler(type);
            handlers[type].Data = this.Data;
        }
        return handlers[type];
    };
}

