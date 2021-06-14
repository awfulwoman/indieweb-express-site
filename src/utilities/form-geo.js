
const convertLatLngStrToObj = function(input) {
  let latLngArray = input.split(',').map(geo => {
    return geo.trim();
  });

  let obj = {};
  obj.lat = latLngArray[0];
  obj.lng = latLngArray[1];

  return obj;
}

module.exports = convertLatLngStrToObj;
