/**
 *
 * @param {string} AtkId
 * @param {string} DefId
 * @constructor
 */
function RaidHandler(AtkId, DefId) {
    this.Ids = {};
    this.Ids[ATK] = AtkId;
    this.Ids[DEF] = DefId;

    this.Run = function (args) {
        args = this.FormatData(args);
        var atkHandler = new AttackerHandler(this.Ids[ATK]);
        var defHandler = new DefenceHandler(this.Ids[DEF]);
        atkHandler.Run(args);
        defHandler.Run(args)
    };

    this.FormatData = function (args) {

        if (!args.hasOwnProperty("date")) {
            args.date = ServerTime.Now();
        }
        args.ScoutData = this.Data[ATK][LOGS].ScoutData;
        return args;
    }
}
