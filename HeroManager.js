function HeroManager(playerId) {
    UserData.call(this, "Building", playerId);

}

HeroManager.prototype = Object.create(UserData.prototype);