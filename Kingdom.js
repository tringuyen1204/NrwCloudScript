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

var GloryPoint = {};

GloryPoint.Set = function (gp, pId) {

  pId = ( pId === null || pId === undefined ) ? PLAYER_ID : pId;

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