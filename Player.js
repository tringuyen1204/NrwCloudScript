Player = function (pId) {
    DefaultHandler.call(this, pId, ["Player"]);

    this.AddExp = function (qty) {
        if (qty <= 0) {
            log.error("exp qty must be positive");
            return false;
        }

        if ("Exp" in this.Data["Player"]) {
            this.Data["Player"].Exp += qty;
        }
        else {
            this.Data["Player"].Exp = qty;
        }
        return true;
    };
};

Player.prototype = Object.create(DefaultHandler.prototype);

var GloryPoint = {};

GloryPoint.Set = function (gp, pId) {

    pId = ( pId === null || pId === undefined ) ? currentPlayerId : pId;

    var points = [-15, -5, 5];

    var elo = Math.randomBetween(0, 9);

    var a;
    for (a = 0; a < points.length; a++) {
        points[a] = Math.floor(points[a] + Math.random() * 10);

        if (points[a] > 0) {
            points[a] = (gp + points[a] * 2) * 10000 + gp;
        }
        else {
            points[a] = (gp + points[a] * -16) * 10000 + gp;
        }
        points[a] = Math.floor(points[a] * 10 + elo);
    }

    var j, x, i;
    for (i = points.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = points[i - 1];
        points[i - 1] = points[j];
        points[j] = x;
    }

    server.UpdatePlayerStatistics({
        PlayFabId: pId,
        Statistics: [
            {
                StatisticName: "BattlePoint1",
                Value: points[0]
            },
            {
                StatisticName: "BattlePoint2",
                Value: points[1]
            },
            {
                StatisticName: "BattlePoint3",
                Value: points[2]
            },
            {
                StatisticName: "GloryPoint",
                Value: gp
            }
        ]
    });
};

GloryPoint.GetChanges = function (result, deltaGP) {

    var A, B;
    var limit;

    if (result) {
        A = -0.0794;
        B = 29.35838;
        limit = 59;
    }
    else {
        A = 0.0531;
        B = 19.60453;
        limit = 39;
    }

    // atk
    var atkGpMod = A * deltaGP + B;

    if (atkGpMod < 0) {
        atkGpMod = 0;
    }
    else if (atkGpMod > limit) {
        atkGpMod = limit;
    }

    // def
    var defGpMod = A * -deltaGP + B;

    if (defGpMod < 0) {
        defGpMod = 0;
    }
    else if (defGpMod > limit) {
        defGpMod = limit;
    }

    if (result) {
        defGpMod = -defGpMod;
    }
    else {
        atkGpMod = -atkGpMod;
    }

    var ret = {};

    ret[ATK] = atkGpMod;
    ret[DEF] = defGpMod;

    return ret;
};
