BattleLog = function (playerId) {
    DataManager.call(this, playerId);
};

BattleLog.prototype = Object.create(DataManager.prototype);

BattleLog.prototype.Update = function (type, id, data) {

    if (!this.Data.hasOwnProperty(type)) {
        this.Data[type] = {};
    }
    this.Data[type][id] = data;
    this.Push();
};

BattleLog.prototype.Get = function (type, id) {
    return this.Data[type][id];
};