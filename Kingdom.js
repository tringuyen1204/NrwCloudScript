Kingdom = function (playerId) {
    DataManager.call(this, "Kingdom", playerId);

    if (this.Data.Exp === null) {
        this.Data.Exp = 0;
    }

    this.AddExp = function (quantity) {
        if (quantity <= 0) {
            log.error("exp quantity must be positive");
            return false;
        }

        this.Data.Exp += quantity;
        this.Push();

        return true;
    };
};

Kingdom.prototype = Object.create(DataManager.prototype);