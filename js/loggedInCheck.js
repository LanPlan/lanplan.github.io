var SERVER_IP = "http://lanplan.esy.es";

window.onload = function(){
  var username = getCookie("auth_username");
  console.log(username);
  console.log("hi");
  if(username != null){
    $.post(SERVER_IP+"/LanParty/verifyuser.php",{
      token: getCookie("auth_token"),
      secret: getCookie("auth_secret"),
      username: username,
      crossDomain: true
    },
    function(data,status){
        if(data.indexOf("true") > -1){
          document.getElementById("profPic").src = "http://avatars.io/twitter/"+username;
        }else if(data == false){
          console.log("not logged in");
        }else{
          console.log("not logged in");
        }
  });
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

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}
