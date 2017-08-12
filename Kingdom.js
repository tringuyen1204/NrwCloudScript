function Kingdom(){
  UserData.call(this, "Kingdom");

  if (this.data.exp == null){
    this.data.exp = 0;
  }

  this.AddExp = function(quantity){
    if (quantity <= 0){
      log.error("exp quantity must be positive");
      return false;
    }

    this.data.exp += quantity;
    this.Push();

    return true;
  }
}

Kingdom.prototype = Object.create(UserData.prototype);
Kingdom.prototype.constructor = UserData;
