BattleHandler = function () {
};

BattleHandler.prototype.Run = function (args) {
    switch (args.command) {
        case CMD_START_BATTLE:
            return this.StartBattle(args);
        case CMD_END_BATTLE:
            return this.EndBattle(args);
    }
    return false;
};

BattleHandler.prototype.StartBattle = function (args) {
};

BattleHandler.prototype.EndBattle = function (args) {
};