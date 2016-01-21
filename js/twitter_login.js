var cb = new Codebird;
var SERVER_IP= "lanplan.esy.es";
cb.setConsumerKey("jKeq5Cw3YDMhZ6bNjY5H5frU6", "YQbJfTTXvCFg8VUs1MGseqCrjh6e7fCSYFL8RS0PhLb8OIQSnt");

var storedToken;
var storedTokenSecret;
var pin;

function signIn(){
$("#buttonContainer").fadeOut('slow', function(){
  $("#buttonContainer").html('<div id="pinInputHolder"><input type="pin" placeholder="PIN" name="pin" id="pin" class="form-control"><input type="submit" value="Submit" id="pinSubmit" onclick="finishAuth();" class="form-control"><input type="submit" value="Back" id="pinBack" onclick="location.reload();" class="form-control"></div>');
  $('#buttonContainer').fadeIn('slow');
});

cb.__call(
    "oauth_requestToken",
    {oauth_callback: "oob"},
    function (reply) {
        // stores it
        console.log(reply);

        cb.setToken(reply.oauth_token, reply.oauth_token_secret);

        // gets the authorize screen URL
        cb.__call(
            "oauth_authorize",
            {},
            function (auth_url) {
                window.codebird_auth = window.open(auth_url,"Twitter Authentication", "height=370,width=480");
            }
        );
      }
);
}

function finishAuth(){
var pin = document.getElementById("pin").value;
var loggedInUser = "";
cb.__call(
  "oauth_accessToken",
  {oauth_verifier: pin},
  function (reply) {
      // store the authenticated token, which may be different from the request token (!)
      cb.setToken(reply.oauth_token, reply.oauth_token_secret);
      console.log(reply);
      loggedInUser = "@"+reply.screen_name;
      storedToken = reply.oauth_token;
      storedTokenSecret = reply.oauth_token_secret;
      $.post("http://"+SERVER_IP+"/LanParty/twitter_login.php",{
      token: reply.oauth_token,
      secret: reply.oauth_token_secret,
      username: "@"+reply.screen_name,
      crossDomain: true
    },
    function(data,status){
        if(data.indexOf("success") > -1){
          $("#buttonContainer").fadeOut('slow', function(){
            $("#buttonContainer").css("width", "100%");
            $("#buttonContainer").css("height", "300px");
            $("#buttonContainer").html('<center><h1>Welcome back <p></p><img id="signInProfPic" class="add img-circle img-responsive" width="100" height="100" src="https://avatars.io/twitter/'+loggedInUser+'?size=large"></p>' + loggedInUser +'</h1></center>');
            $('#buttonContainer').fadeIn('slow');
          });

          setCookie("auth_username", loggedInUser, 100);
          setCookie("auth_token", storedToken, 100);
          setCookie("auth_secret", storedTokenSecret, 100);
          console.log("stored cookies");
        }else{
          alert(data);
        }
    });
  }
);
}

function setCookie(c_name,value,exdays){
  var exdate=new Date();
  exdate.setDate(exdate.getDate() + exdays);
  var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
  document.cookie=c_name + "=" + c_value;
}
