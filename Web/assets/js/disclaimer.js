document.getElementById("disclaimer").innerHTML = "<div id='mainy'>*Please ensure that you do not disclose detailed information about minors. Beware of all users who you do not personally know!<span id='toClose'>&times;</span></div></div>"

var closebtns = document.getElementById("mainy");
closebtns.addEventListener("click", function() {
                           closebtns.style.display = 'none';
                           });

