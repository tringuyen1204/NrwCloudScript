function BattleHandler(pId) {
    DefaultHandler.call(this, pId, [BUILDING, LOGS, RESOURCE, INV]);

    /**
     *
     * @param args
     * @returns {boolean}
     * @constructor
     */
    this.Run = function (args) {
        var result = false;
        switch (args.command) {
            case CMD.BATTLE.START:
                result = this.StartBattle(args);
                break;
            case CMD.BATTLE.UPDATE:
                result = this.UpdateBattle(args);
                break;
            case CMD.BATTLE.END:
                result = this.EndBattle(args);
                break;
        }
        if (result) {
            this.Push();
        }
        return result;
    };

    this.StartBattle = function (args) {

        var noError = true;

        if (!(MERC in args)) {
            return false;
        }

        for (var a = 0; a < args[MERC].length; a++) {
            if (!this.UseMerc(args[MERC][a])) {
                noError = false;
                break;
            }
        }

        return noError;
    };

    this.UseMerc = function (id) {

        var inventory = this.Data[INV];
        if (inventory === null || inventory === undefined) {
            log.error("inventory null");
            return false;
        }

        if (!(id in inventory) || inventory[id] <= 0) {
            log.error("inventory doesn't contain this merc: " + id);
            return false;
        }
        inventory[id]--;

        if (inventory[id] === 0) {
            delete inventory[id];
        }
        return true;
    };

    this.EndBattle = function (args) {
        return false;
    };

    this.UpdateBattle = function (args) {
        return false;
    };
}

BattleHandler.prototype = Object.create(DefaultHandler.prototype);

function AttackerHandler(playerId) {

    BattleHandler.call(this, playerId);
    this.base = new BattleHandler();
    this.type = ATK;

    this.StartBattle = function (args) {

        if (this.type === ATK) {
            if (!this.base.StartBattle.call(this, args)) {
                return false;
            }
        }

        if (!(this.type in this.Data[LOGS])) {
            this.Data[LOGS][this.type] = {};
        }

        if (this.type === ATK) {
            this.Data[LOGS].ScoutData.LastLogId = String(args.date);
        }

        var scoutData = args.ScoutData;

        args.LastLogId = String(args.date);
        this.UpdateBattleLog(args);

        var changes = GloryPoint.GetChanges(false, scoutData.AtkGp - scoutData.DefGp);

        var log = this.Data[LOGS][this.type][args.LastLogId];
        log.AtkGpChange = changes[ATK];
        log.DefGpChange = changes[DEF];

        if (this.type === ATK) {
            GloryPoint.Set(scoutData.AtkGp + log.AtkGpChange, scoutData.AtkId);
        }
        else {
            GloryPoint.Set(scoutData.DefGp + log.DefGpChange, scoutData.DefId);
        }
        return true;
    };

    this.UpdateBattle = function (args) {
        return this.UpdateBattleLog(args);
    };

    this.UpdateBattleLog = function (args) {

        var log = {
            Result: "Unresolved"
        };

        log.ScoutData = args.ScoutData;
        log.LastActiveDate = args.date;

        var logId = args.LastLogId;

        this.Data[LOGS][this.type][logId] = log;

        if (this.type === DEF) {
            this.Data[LOGS].LastDefendDate = args.date;
        }
        return true;
    };

    this.EndBattle = function (args) {
        if (args.result) {

            var resMan = new ResHandler(this.playerId, this.Data[RES]);
            var scoutData = args.ScoutData;

            resMan.Change(RES.GOLD, scoutData[RES.GOLD] + scoutData["ProducedGold"]);
            resMan.Change(RES.FOOD, scoutData[RES.FOOD] + scoutData["ProducedFood"]);
        }

        var changes = GloryPoint.GetChanges(args.result, scoutData.AtkGp - scoutData.DefGp);
        GloryPoint.Set(scoutData.AtkGp + Math.floor(changes[ATK]), this.playerId);

        if ("Casualties" in args) {
            var bMan = new BuildManager(this.playerId, this.Data[RES]);
            bMan.ApplyCasualties(args);
        }

        this.UpdateResultLog(args);

        return true;
    };

    this.UpdateResultLog = function (args) {
        var logId = scoutData.LastLogId;
        var log = this.Data[LOGS][this.type][logId];

        if (args.result) {
            log.Result = "Attacker Win";
        }
        else {
            log.Result = "Defender Win";
        }

        if ("Casualties" in args) {
            log.Casualties = args.Casualties;
        }
    }
}

AttackerHandler.prototype = Object.create(BattleHandler.prototype);

function DefenceHandler(playerId) {
    AttackerHandler.call(this, playerId);
    this.type = DEF;

    this.EndBattle = function (args) {

        var scoutData = args.ScoutData;

        if (args.result) {
            var b = new BuildManager(this.playerId, this.Data[BUILDING]);
            b.ApplyRaid(args);

            var r = new ResHandler(this.playerId, this.Data[RESOURCE]);
            r.ApplyRaid(args);
        }

        var changes = GloryPoint.GetChanges(args.result, scoutData.AtkGp - scoutData.DefGp);
        GloryPoint.Set(scoutData.DefGp + Math.floor(changes[DEF]), this.playerId);

        this.UpdateResultLog(args);

        return true;
    }
}

DefenceHandler.prototype = Object.create(AttackerHandler.prototype);
