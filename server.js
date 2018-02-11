const tinyspeck = require('tinyspeck');
const cheerio = require('cheerio');
const axios = require('axios');

const slack = tinyspeck.instance();

const locationStore = require('./stores/locations');
const usersStore = require('./stores/users');

const url = 'http://www.swellnet.com/reports';
const updatedClass = '.views-field-field-surf-report-date';
const surfClass = '.views-field-nothing';
const windsClass = '.views-field-field-surf-report-wind';
const weatherClass = '.views-field-field-surf-report-weather';
const ratingClass = '.views-field-field-surf-report-rating';
const reportClass = '.views-field-body';


slack.on('/surfhelp', message => {
  let text = "Type '/surfreport' to begin. Select your country and then a place for which you want the latest surf report.\n\nSurf Reports always remembers your last selection so you don't have to search again. Simply type '/surfreport' and a report of the last selection you made will appear.\n\nIn the case where you would like to select a new place, type '/surfreport search' to search for new places.\n\nSend any feedback to boiyell1@gmail.com";
  
  respond(message.body.channel_id, text);
});

slack.on('/surfreport', message => {
  
  let user = usersStore.data.getUser(message.body.user_id);
  let place = message.body.text.toLowerCase();
  
  if (place === undefined || place === "" || place === "search") {
    
    if(user === undefined ||
      user === null ||
      place === "search") {
      
      let countries = locationStore.data.getCountries();

      var buttons = [];
      countries.forEach(function (value, i) {
          buttons.push(
            {
              "name": "country",
              "text": titleCase(value),
              "type": "button",
              "value": value
            });
      });

      let attachments = [{
        "title": "Select Location",
        "attachment_type": "default",
        "fallback": "Upgrade your Slack client to use messages like these.",
        "callback_id": "country_selection",
        "actions" : buttons
      }];

      respond(message.body.channel_id, "", attachments);
      
      return;
    }
    else {
      place = user.place;
    }
  }
  
  let reportUrl = getUrl(place);
   
  if(reportUrl === "")
  {
    respond(message.body.channel_id, "Couldn't find place '" + place + "'");
    
    return;
  }
  
  usersStore.data.setUser(message.body.user_id, place);
  
  scrape(message.body.channel_id, user.id, place, reportUrl);
});

function scrape(channelId, userId, place, reportUrl) {
  axios
    .get(reportUrl,{'timeout': 3000})
    .then(response => {
    
      let $ = cheerio.load(response.data);
      let content = $('.view-surf-reports');

      let updated = content
        .find(updatedClass)
        .children('.field-content')
        .first()
        .text();

      let surf = content
        .find(surfClass)
        .children('.field-content')
        .first()
        .text();

      let winds = content
        .find(windsClass)
        .children('.field-content')
        .first()
        .text();

      let weather = content
        .find(weatherClass)
        .children('.field-content')
        .first()
        .text();

      let rating = content
        .find(ratingClass)
        .children('.field-content')
        .first()
        .text();

      let report = content
        .find(reportClass)
        .children('.field-content')
        .first()
        .text();
    
      let fields = [
        {
          "title": "Updated",
          "value": updated,
          "short": true
        },
        {
          "title": "Surf",
          "value": surf,
          "short": true
        },
         {
          "title": "Winds",
          "value": winds,
          "short": true
        },
       {
        "title": "Weather",
        "value": weather,
        "short": true
        },
         {
          "title": "Rating",
          "value": rating,
          "short": true
        },
         {
          "title": "Report",
          "value": report,
          "short": false
        },
      ];
      
      let attachments = [{
        "title": "Surf Report for " + titleCase(place),
        "title_link" : reportUrl,
        "fields" : fields
      }];
    
      respond(channelId, "", attachments);
      
      return ;
  })
  .catch(error => {
    if(error.code === 'ECONNABORTED') {
      respond(channelId, "Couldn't reach swellnet.com for surf reports");
    }
  });
}

slack.on('/interactions' , message => {
  
  if(message.body.callback_id === "country_selection") {
    let country = message.body.actions[0].value;
    
    let states = locationStore.data.getStates(country);
    
    let optionGroups = [];
    
    states.sort().forEach(function (state, i) {
      let places = locationStore.data.getPlaces(state);
      let options = [];
      
      places.sort().forEach(function (place, i){
        options.push({
          "text": titleCase(place),
          "value": place
        });
      });
      
      optionGroups.push({
        "text": titleCase(state),
        "options": options
      });
    });
    
    let action = {
      "name": "places_list",
      "replace_original":true,
      "type": "select",
      "option_groups": optionGroups
    };
      
    let attachments = [{
      "title": "Where in " + titleCase(country) + "?",
      "replace_original":true,
      "attachment_type": "default",
      "fallback": "Upgrade your Slack client to use messages like these.",
      "callback_id": "place_selection",
      "actions" : [action]
    }];
    
    respond(message.body.channel.id, "", attachments, message.body.message_ts);
  }
  else if(message.body.callback_id === "place_selection") {
    let place = message.body.actions[0].selected_options[0].value;
    
    usersStore.data.setUser(message.body.user.id, place);
    
    scrape(message.body.channel.id, message.body.user.id, place, getUrl(place));
  }
});

function respond(channel, text, attachments = [], ts = ''){
  let replace = ts != '';
  console.log("replace: "+replace);
  let responseMessage = {
    ts: ts,
    token: process.env.BOT_TOKEN,
    channel: channel,
    text: text,
    replace_original: replace,
    attachments: attachments,
    as_user: false
  };
  
  slack
    .send(responseMessage)
    //.then(data => {console.log(data)});
}

function getUrl(place) {
  let state = locationStore.data.getState(place)
  
  if(state === "") {
    return "";
  }
  
  let formattedUrl =  url + "/" + locationStore.data.getCountry(state) + "/" + state +  "/" + place;
  
  return formattedUrl
    .split(" ")
    .join("-")
    .toLowerCase();
}

function titleCase(str) {
  
  str = str.toLowerCase().split(' ');
  
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
  }
  
  return str.join(' ');
}

slack.listen(process.env.PORT, process.env.VERIFICATION_TOKEN);