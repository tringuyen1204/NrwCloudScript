function BuildHandler() {
    DefaultHandler.call(this);

    this.DefaultData = function (args) {
        return {
            "Lvl": 0,
            "Pos": args.position
        }
    };
}

BuildHandler.prototype = Object.create(DefaultHandler.prototype);
