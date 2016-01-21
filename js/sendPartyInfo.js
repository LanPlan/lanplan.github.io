var SERVER_IP = "http://lanplan.esy.es";

function checkToSend(){
  if(getCookie("auth_username") != null){
    var user = getCookie("auth_username");
    var userToken = getCookie("auth_token");
    var userSecret = getCookie("auth_secret");
    var game = document.getElementById("input-game").value;
    var gameUrl = document.getElementById("input-game_url").value;
    var players = document.getElementById("input-players").value;
    var type = document.getElementById("input-type").value;
    var date = document.getElementById("input-date").value;
    var desc = document.getElementById("input-desc").value;
    console.log("1"+game);
    console.log("2"+gameUrl);
    console.log("3"+type);
    console.log("4"+date);
    console.log("5"+desc);
    if(game != "" && gameUrl != "" && type != "" && date != "" & desc != "" && players != ""){
      var address = document.getElementById('input-address').value;
      var geocoder= new google.maps.Geocoder();
      geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          var lat = results[0].geometry.location.lat();
          var lng = results[0].geometry.location.lng();
          $.post(SERVER_IP+"/LanParty/addparty.php",{
            game: game,
            game_url: gameUrl,
            type: type,
            date: date,
            desc: desc,
            lat: lat,
            lng: lng,
            players: players,
            username: user,
            auth_token: userToken,
            auth_secret: userSecret,
            crossDomain: true
          },
          function(data,status){
              if(data != "success"){
                alert(data);
              }else{
                alert("Success, created lan party.");
              }
        });
        } else {
          alert('Failed to get location due to following reason: ' + status);
        }
      });



    }else{
      alert("Please fill in all fields!");
    }
  }else{
    alert("You need to be logged in!");
  }

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
