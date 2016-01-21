var xmlhttp = new XMLHttpRequest();
var SERVER_IP= "http://lanplan.esy.es/LanParty/getEvents.php";
var username = getCookie("auth_username");
var url = SERVER_IP +"?username="+username;

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

xmlhttp.onreadystatechange=function() {
     if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
       parseEvents(xmlhttp.responseText);
     }
 }
 xmlhttp.open("GET", url, true);
 xmlhttp.send();

function parseEvents(response) {
  console.log(response);
    var arr = JSON.parse(response);
    var i;
    var out = "<table id='eventsTbl' class='table table-striped' data-toggle='table'><tr><th data-field='username'>Host</th><th data-field='game'>Game</th><th data-field='game_type'>Game Type</th><th data-field='current_players'>Current Players Attending</th><th data-field='max_players'>Max Player Attendees</th><th data-field='party_latitude'>Location's Latitude</th><th data-field='party_longitude'>Location's Longitude</th><th data-field='party_date'>Date & Time</th><th data-field='party_desc'>Party Description</th></tr><tr>";

    for(i = 0; i < arr.length; i++) {
        var gametype = arr[i].party_type
        if(gametype == 1){
          arr[i].party_type = "Competitive";
        }else{
          arr[i].party_type = "Casual";
        }
        out += "<td>" +
        arr[i].username +
        "</td><td>" +
        arr[i].game +
        "</td><td>" +
        arr[i].party_type +
        "</td><td>" +
        arr[i].current_players +
        "</td><td>" +
        arr[i].max_players +
        "</td><td>" +
        arr[i].party_latitude +
        "</td><td>" +
        arr[i].party_longitude +
        "</td><td>" +
        arr[i].party_date +
        "</td><td>" +
        arr[i].party_desc +
        "</td></tr>";
    }
    out += "</table>";
    document.getElementById("eventsTable").innerHTML = out;
}

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
});
