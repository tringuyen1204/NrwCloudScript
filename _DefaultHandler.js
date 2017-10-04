function DefaultHandler(pId, keys) {
    this.PlayerId = (pId !== undefined && pId !== null) ? pId : currentPlayerId;
    ServerData.Get(this.PlayerId).Load(keys);
    this.Data = ServerData.Get(this.PlayerId).Data;

    this.GetClass = function (id) {
        var temp = id.split('.')[0];
        switch (temp) {
            case BUILDING:
                return BUILDING;
            case GENERAL:
            case ADVISOR:
                return HERO;
            case TECH:
                return TECH;
            case TROOP:
                return TROOP;
            case MERC:
                return INV;
            case RESOURCE:
                return RESOURCE;
        }
    };

    this.GetType = function (id) {
        return id.split('.')[1];
    };

    this.Get = function (id) {

        var objClass = Handler.GetClass(id);
        if (this.Data[objClass].hasOwnProperty(id)) {
            return this.Data[objClass][id];
        }
        else {
            return null;
        }
    };

    this.Push = function () {
        ServerData.Get(this.PlayerId).Push();
    }
}