const _ = require("underscore");

const methods = {};

methods.getStates = function(country) {
  return getKeys(states, country);
}

methods.getPlaces = function (state) {
  return getKeys(places, state);
}

methods.getState = function (place) {
  if(_.has(places, place)) {
    return places[place];
  }
  else {
    return "";
  }
}

methods.getCountries = function () {
  return countries;
}

methods.getCountry = function (state) {
  if(_.has(states, state)) {
    return states[state];
  }
  else {
    return "";
  }
}

const countries = [
  "australia",
  //"hawaii",
  //"pacific ocean",
  // "asia",
  // "new zealand",
  // "atlantic ocean",
  // "africa",
  // "indonesia",
  // "united kingdom",
  // "europe",
  // "mediterranean",
];

const states = {
  "queensland" : "australia",
  "new south wales" : "australia",
  "western australia" : "australia",
  "northern territory" : "australia",
  "tasmania" : "australia",
  "south australia" : "australia",
}

const places = {
  "bargara": "queensland",
  "agnes water": "queensland",
  "yeppoon": "queensland",
  "muralug island": "queensland",
  "albatross bay": "queensland",
  "mitchell river": "queensland",
  "karumba": "queensland",
  "fraser island": "queensland",
  "sunshine coast": "queensland",
  "north stradbroke island": "queensland",
  "gold coast": "queensland",
  
  "coffs harbour": "new south wales",
  "scotts head": "new south wales",
  "port macquarie": "new south wales",
  "old bar": "new south wales",
  "forster": "new south wales",
  "seal rocks": "new south wales",
  "port stephens": "new south wales",
  "newcastle": "new south wales",
  "central coast": "new south wales",
  "northern beaches": "new south wales",
  "eastern beaches": "new south wales",
  "cronulla": "new south wales",
  "coal coast": "new south wales",
  "wollongong": "new south wales",
  "shellharbour": "new south wales",
  "gerringong": "new south wales",
  "jervis bay": "new south wales",
  "ulladulla": "new south wales",
  "batemans bay": "new south wales",
  "narooma": "new south wales",
  "merimbula": "new south wales",
  "eden": "new south wales",
  "cabarita": "new south wales",
  "byron bay": "new south wales",
  "ballina": "new south wales",
  "yamba": "new south wales",
  
  "perth": "western australia",
  "yanchep": "western australia",
  "lancelin": "western australia",
  "jurien bay": "western australia",
  "geraldton": "western australia",
  "abrolhos islands": "western australia",
  "kalbarri": "western australia",
  "dirk hartog island": "western australia",
  "gnaraloo": "western australia",
  "exmouth": "western australia",
  "broome": "western australia",
  "berkeley river": "western australia",
  "kimberley coast": "western australia",
  "middle lagoon": "western australia",
  "port smith": "western australia",
  "eighty mile beach": "western australia",
  "port headland": "western australia",
  "balla balla": "western australia",
  "barrow island": "western australia",
  "esperance": "western australia",
  "albany": "western australia",
  "windy harbour": "western australia",
  "cape leeuwin": "western australia",
  "margaret river": "western australia",
  "yallingup": "western australia",
  "bunbury": "western australia",
  "mandurah": "western australia",
  "rottnest island": "western australia",
  
  "calvert river": "northern territory",
  "sir edward pellew group of islands": "northern territory",
  "maria island": "northern territory",
  "nhulunbuy": "northern territory",
  "elcho island": "northern territory",
  "smith point": "northern territory",
  "dundee beach": "northern territory",
  "new moon inlet": "northern territory",
  "victoria": "northern territory",
  "mallacoota": "northern territory",
  "point hicks": "northern territory",
  "cape conran": "northern territory",
  "lakes entrance": "northern territory",
  "90 mile beach": "northern territory",
  "wilsons promontory": "northern territory",
  "cape liptrap": "northern territory",
  "cape paterson": "northern territory",
  "wonthaggi": "northern territory",
  "phillip island": "northern territory",
  "flinders": "northern territory",
  "mornington peninsula": "northern territory",
  "barwon heads": "northern territory",
  "torquay": "northern territory",
  "cape otway": "northern territory",
  "port campbell": "northern territory",
  "warrnambool": "northern territory",
  "portland": "northern territory",
  
  "king island east": "tasmania",
  "king island west": "tasmania",
  "flinders island east": "tasmania",
  "flinders island west": "tasmania",
  "eddystone": "tasmania",
  "st helens": "tasmania",
  "four mile creek": "tasmania",
  "bicheno": "tasmania",
  "eaglehawk neck": "tasmania",
  "shipstern bluff": "tasmania",
  "roaring beach": "tasmania",
  "south arm": "tasmania",
  "cloud bay": "tasmania",
  "south east cape": "tasmania",
  "south west cape": "tasmania",
  "low rocky point": "tasmania",
  "cape sorell": "tasmania",
  "trial harbour": "tasmania",
  "sandy cape": "tasmania",
  "marrawah": "tasmania",
  "cape grim": "tasmania",
  "stanley": "tasmania",
  "burnie": "tasmania",
  "devonport": "tasmania",
  "low head": "tasmania",
  
  "port macdonnell": "south australia",
  "beachport": "south australia",
  "robe": "south australia",
  "middleton": "south australia",
  "waitpinga": "south australia",
  "kangaroo island south coast": "south australia",
  "kangaroo island west coast": "south australia",
  "kangaroo island north coast": "south australia",
  "mid coast": "south australia",
  "yorke peninsula": "south australia",
  "sleaford bay": "south australia",
  "point avoid": "south australia",
  "elliston": "south australia",
  "streaky bay": "south australia",
  "cactus": "south australia",
  "fowlers bay": "south australia",
}

function getKeys(array, value){
  let keys = [];
  
  _.each(array, function(val, key ) {
    if (val===value) {
      keys.push(key);
    }
  });
  
  return keys;
}

exports.data = methods;