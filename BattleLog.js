function BattleLog(playerId) {
    DataManager.call(this, playerId);

    this.Update = function (type, id, data) {

        if (!this.Data.hasOwnProperty(type)) {
            this.Data[type] = {};
        }
        this.Data[type][id] = data;
        this.Push();
    };

    this.Get = function (type, id) {
        return this.Data[type][id];
    };
}

BattleLog.prototype = Object.create(DataManager.prototype);