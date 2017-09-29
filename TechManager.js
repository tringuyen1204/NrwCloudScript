function TechManager(playerId) {
    DefaultManager.call(this, [TECH], playerId);

    this.GetHandler = function (args) {
        var type = args.type;
        for (var a = 0; a < TECH_LIST.length; a++) {
            if (TECH_LIST[a] === type) {
                var ret = DefaultManager.prototype.GetHandler.call(this, args);
                ret.Data = this.GetData();
            }
        }
        return null;
    };
}

TechManager.prototype = Object.create(DefaultManager.prototype);
