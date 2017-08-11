function ConvertTimeToDiamond(seconds) {
  if (seconds <= 0)
    return 0;

  var hours = seconds / 3600.0;
  var ret = 25.18375 * Math.pow(hours, 0.7513);

  if (ret > Math.floor(ret))
    ret = ret + 1;

  return ret;
}

// convert gold and food to diamond
function ConvertResourceToDiamond(resources){

  if (resources <= 0)
    return 0;

  var ret = Math.pow(6, Math.log(resources) / Math.LOG10E - 2);

  if (ret <= 0)
    ret = 1;

  return ret;
}
