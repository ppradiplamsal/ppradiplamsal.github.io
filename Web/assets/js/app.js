
$.holdReady(true);

$.getScript(((window.location.protocol == 'file:') ? "http:" : window.location.protocol) +
    "//api.backendless.com/sdk/js/latest/backendless.min.js", function() {
    $.holdReady(false);
    (function ($) {
        $.fn.wrongInput = function () {
            return this.each(function () {
                var $this = $(this),
                    $field = $this.is("input.txt") || $this.is("input[type=text]") ? $this : $this.find("input.txt"),
                    rmWrng = function ($field) {
                        $field.removeClass('wronginput');
                    };
                if ($field.hasClass('wronginput')) {
                    return
                }
                $field.addClass('wronginput');
                $field.one('input', function () {
                    rmWrng($field);
                });
            });
        };
    })(Zepto);

    function createPopup(text, type) {
        var $popup = $("<div class='popup'></div>"),
            $body = $('body');
        if (type) {
            $popup.addClass(type);
        }
        $popup.text(text);
        if ($body.find('.popup').length) {
            $('.popup').remove();
        }
        $body.append($popup);
        $popup.animate({
            right: '20px',
            opacity: 0.8
        }, 500);
        setTimeout(function () {
            $popup.animate({
                right: '-' + $popup.width() + 'px',
                opacity: 0
            }, 500);
            setTimeout(function () {
                $popup.remove();
            }, 500);
        }, 3000);
    }

    function userLoggedInStatus(user) {
        console.log("user has logged in");
        $('.login').hide();
        $('.logined').show();
    }

    
//Backendless: defaults
var APPLICATION_ID = '41E7CE4A-EDEC-6FC2-FF34-B6CD05DAFC00';
var API_KEY = 'EF68F6B0-AD70-0DB8-FF34-F79D27839900';
Backendless.serverURL = "https://api.backendless.com";
Backendless.initApp(APPLICATION_ID, API_KEY);

if (!APPLICATION_ID || !API_KEY)
    alert("Missing application ID or api key arguments. Login to Backendless Console, select your app and get the ID and key from the Manage > App Settings screen. Copy/paste the values into the Backendless.initApp call located in HomeSchool-Login.js");
    

    var loggedInUser, username, password, remember;

    var cache = Backendless.LocalCache.getAll();
    if (cache["stayLoggedIn"]) {
       var tokenExist = Backendless.UserService.isValidLogin();

       if (tokenExist) {
          userLoggedInStatus(cache["user-token"]);
       } else {
          Backendless.LocalCache.clear();
       }
    }

    function gotError(err) { // see more on error handling
        $('input').addClass("redBorder");

        console.error(err);

        if (err.code != 0) {
            createPopup(err.message || err, 'error');
            console.log("error message - " + err.message);
            console.log("error code - " + err.statusCode);
        }
    }

    function userLoggedOut() {
        location.reload();
    }

    function logoutUser() {
        localStorage.clear();
        Backendless.UserService.logout().then(userLoggedOut, gotError);
    }

    function userLoggedOut1(){
        window.location.replace("login2.html");
    }
    function logoutUser1() {
        console.log("logging out");
        localStorage.clear();
        Backendless.UserService.logout().then(userLoggedOut1, gotError);
    }

    $('#logout').on('click',function() {
        logoutUser1();
    });

                                
    function callback(user) {
        $('.logined').show();
        $('.login').hide();

        console.log(user);
    }

                                
    $('#fb_login').on('click', function() {
        Backendless.UserService.loginWithFacebook({ email: 'email', name: 'name' }, 'public_profile,email', remember).then(callback, gotError);
    });
                                
});
