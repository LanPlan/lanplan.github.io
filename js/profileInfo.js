var username;

getUsername();
getNameAndPic();
getRep();

function getUsername(){
  username = getQueryVariable("username");
  if(username == false){
    username = getCookie("auth_username");
  }
}

function getNameAndPic(){

    if(username !=null){
      document.getElementById("profilePageImg").src = "http://avatars.io/twitter/"+username;
      document.getElementById("tProf").innerHTML = username;

      var twitterProfile = document.getElementById('tProf').href;
      twitterProfile = twitterProfile.replace("c4r15.github.io/log_in.html", "twitter.com/"+username);
      document.getElementById('tProf').href = twitterProfile;
    }
}

function getRep(){

  $.getJSON(SERVER_IP+"/LanParty/getUserRep.php?username="+username, function(json) {
    var repObjects = json;
    if(repObjects.length > 0){
      var friendly_rep = repObjects[0].friendly_rep;
      var host_rep = repObjects[0].host_rep;
      var mvp = repObjects[0].MVP;

      document.getElementById("friendlyRep").innerHTML =  " " + friendly_rep + "% &nbsp;&nbsp;";
      document.getElementById("hostRep").innerHTML = " " + host_rep + "% &nbsp;&nbsp;"
      document.getElementById("mvps").innerHTML = " " + mvp;
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

    function getQueryVariable(variable){
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
    }

  $(document).ready(function(){
      $('[data-toggle="tooltip"]').tooltip();
  });
