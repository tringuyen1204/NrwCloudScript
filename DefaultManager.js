function DefaultManager(keys, playerId) {
    this.PlayerId = (playerId !== undefined && playerId !== null) ? playerId : currentPlayerId;
    this.Keys = keys;

    this.GetData = function () {
        if (this.Data === null || this.Data === undefined) {
            this.Data = UserData.Get(keys, this.PlayerId);
        }
        return this.Data;
    };

    this.Push = function (args) {
        this.PushNow();
    };

    this.PushNow = function () {
        UserData.Update(this.GetData(), this.PlayerId);
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
        var handler = this.GetHandler(args.type);

        if (handler !== null && handler.Run(args)) {
            this.Push(args);
        }
        return this.GetData();
    };

    this.GetHandler = function () {
        var handler = new DefaultHandler();
        handler.Data = this.GetData();
        return handler;
    };
}
