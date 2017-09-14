function DataManager(Key, playerId) {
    this.Handlers = {};
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

    this.GetDate = function (args) {
        if (args === null || args === undefined || !args.hasOwnProperty("date")) {
            return Date.now();
        }
        return Number(args.date);
    };

    this.Execute = function (args) {
        args.date = this.GetDate(args);
        var handler = this.GetHandler(args);
        var canPush = false;

        if (args.command in handler) {
            canPush = handler[args.command](args);
        }

        if (canPush) {
            this.Push(args);
        }
    };

    this.GetHandler = function (args) {
        var handlers = this.Handlers;
        var type = args.type;

        if (handlers.hasOwnProperty(type)) {
            handlers[type] = new DataHandler(type);
            handlers[type].Data = this.Data;
        }
        return handlers[type];
    }
}
