$(function() {
    $('body').mousedown(function(e){if(e.button==1)return false});
});

var map;
var SERVER_IP= "http://lanplan.esy.es";
function initialize() {

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
        position.coords.longitude);

        var mapOptions = {
          center: { lat: position.coords.latitude, lng: position.coords.longitude},
          zoom: 17,
          disableDefaultUI: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById('mapCanvas'),
        mapOptions);

        //I am an legend
        var legend = document.createElement("div");
        legend.id = "legend";
        var content = [];
        content.push('<img id="legend-icon" src="assets/graphics/legend-icon.png">');
        content.push('<p><img src="assets/graphics/greenmarker.png"> Looking for players</p>');
        content.push('<p><img src="assets/graphics/bluemarker.png"> Starting soon</p>');
        content.push('<p><img src="assets/graphics/redmarker.png"> Full</p>');

        legend.innerHTML = content.join('');
        legend.index = 1;
        map.controls[google.maps.ControlPosition.LEFT_TOP].push(legend);

        var GeoMarker = new GeolocationMarker(map);
        var geoMarkerCircle = new google.maps.Circle({radius: 10});
        geoMarkerCircle.bindTo("center", GeoMarker, "position");
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }



  $.getJSON(SERVER_IP+"/LanParty/cleanExpiredParties.php", function() {
  });


  $.getJSON(SERVER_IP+"/LanParty/getallparties.php", function(json) {
    parseJSON(json);
  });
}

function addPartyToMap(data){
  var host = data[0];
  var game = data[1];
  var players = data[2];
  var maxPlayers = data[3];
  var desc = data[4];
  var lat = data[5];
  var lng = data[6];
  var partyType = data[7];
  var dateTime = data[8];
  var gameURL = data[9];
  var partyID = data[10];
  var latLng = new google.maps.LatLng(lat,lng);

  var contentString = "<a id='hostNameRef' href='/profile.html?username="+host+"'><h1 id='hostName'><b>"+host+"</b></a><b>'s Party</b></h1> \n <a id='gameRef' target='_blank' href='"+gameURL+"'><h2 id='gameTxt'>"+game+"<h2></a> \n <h3>"+partyType+"</h3> \n <h3>"+dateTime+"</h3> \n <h4>"+players+"/"+maxPlayers+" players</h4> \n <p>---------------------------------</p> \n <h5>"+desc+"</h5> <button type='button' id='joinParty' onclick='joinParty("+partyID+");' class='btn btn-default'>Join Party</button>";

  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });

  //Determine marker colour
  var dateonly = dateTime.substr(0, 10);
  dateonly = dateonly.split("/");
  var year = dateonly[2];
  var month = dateonly[1];
  var day = dateonly[0];
  var time = dateTime.substr(15,19);

  var partyDateJS = new Date(year+'-'+month+'-'+day+'T'+time);
  var timeNow = new Date();
  var hoursLeft = (partyDateJS.getTime() - timeNow.getTime()) / 1000 / 60 / 60;
  console.log("Date format " + year+'-'+month+'-'+day+'T'+time);
  console.log(partyDateJS.getTime());
  console.log("time: " + time);
  console.log("Hours Left = "+ hoursLeft);
  var markerImg = "assets/graphics/greenmarker.png";
  if(players == maxPlayers){
    markerImg = "assets/graphics/redmarker.png";
  }else if(hoursLeft <= 12){
    markerImg = "assets/graphics/bluemarker.png";
  }

  var marker = new google.maps.Marker({
    icon: {url:markerImg},
    position: latLng,
    map: map,
    title: host+"'s Party",
    animation: google.maps.Animation.DROP
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
  });
}

function parseJSON(json){
  var partyObjects = json;
  for(var i = 0; i < partyObjects.length; i++){
    var gameType = partyObjects[i].party_type;
    if(gameType == 0){
      gameType = "Casual";
    }else{
      gameType = "Competitive"
    }
    var date = partyObjects[i].party_date;

    var dateonly = date.substr(0, 10);
    dateonly = dateonly.split("-");
    var year = dateonly[0];
    var month = dateonly[1];
    var day = dateonly[2];

    var time = date.substr(10,15);

    date = day + "/" + month + "/" + year + " at " + time;

    var data = [partyObjects[i].username, partyObjects[i].game, partyObjects[i].current_players, partyObjects[i].max_players, partyObjects[i].party_desc, partyObjects[i].party_latitude, partyObjects[i].party_longitude, gameType,date,partyObjects[i].party_game_url, partyObjects[i].ID];
    console.log("TESTING FROM HERE");
    console.log(data[0]);
    console.log(data[1]);
    console.log(data[2]);
    console.log(data[3]);
    console.log(data[4]);
    console.log(data[5]);
    console.log(data[6]);
    console.log(data[7]);
    console.log(data[8]);
    console.log(data[9]);
    console.log(data[10]);

    addPartyToMap(data);
  }
}

function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    zoom: 10,
    position: new google.maps.LatLng(52.4831, -1.8936),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}

function joinParty(partyID){
  var username = getCookie("auth_username");
  var auth_token = getCookie("auth_token");
  var auth_secret = getCookie("auth_secret");
  console.log(username +"u");
  console.log(auth_token +"t");
  console.log(auth_secret +"s");
  $.post(SERVER_IP+"/LanParty/addTicket.php",{
    party_id: partyID,
    username: username,
    auth_token: auth_token,
    auth_secret: auth_secret,
    crossDomain: true
  },
  function(data,status){
      if(data != "success"){
        alert(data);
      }else{
        alert("Success");
      }
});
}

function getCookie(c_name){
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start == -1){
        c_start = c_value.indexOf(c_name + "=");
    }
    if (c_start == -1){
        c_value = null;
    }else{
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end == -1){
            c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start,c_end));
    }
    return c_value;
}

google.maps.event.addDomListener(window, 'load', initialize);
