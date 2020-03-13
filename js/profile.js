// const fb_id = document.querySelector(".fb-id");
// const fb_name = document.querySelector(".fb-name");
const fb_name = document.querySelector(".fb-name");
const fb_email = document.querySelector(".fb-email span");
const fb_pic = document.querySelector(".fb-pic");

window.fbAsyncInit = function() {
    FB.init({
      appId      : '456322688611105',
      cookie     : true,                     // Enable cookies to allow the server to access the session.
      xfbml      : true,                     // Parse social plugins on this webpage.
      version    : 'v5.0'          // Use this Graph API version for this call.
    });
    FB.getLoginStatus(function(response) {   // Called after the JS SDK has been initialized.
        if (response.status === 'connected') {
            connect_fb_api(response);
        } else {
            FB.login(function(response) {
                if (response.status === 'connected') {
                    connect_fb_api(response);
                } else {
                    alert("您尚未登入FB會員");
                    window.location.href = "index.html";
                }
            },{scope: 'public_profile,email'});
        }
    });
};

(function(d, s, id) {                      // Load the SDK asynchronously
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

let fb_data = {};
function connect_fb_api(response) { 
    FB.api('/me', {"fields": "name,email,picture"}, function(response){
        console.log(response);
        console.log(response.picture);
        console.log(response.picture.data);
        fb_data = {
            // "id": response.id,
            "name": response.name,
            "email": response.email,
            "picture": response.picture.data.url
        };
        render_profile(fb_data);
    });
}

function render_profile(fb_data) {
    // fb_id.innerHTML = `${fb_data.id}`;
    fb_name.innerHTML = `${fb_data.name}`;
    fb_email.innerHTML = `${fb_data.email}`;
    fb_pic.src = `${fb_data.picture}`;
}

// function reder_profile(fb_data, render_callback){
//     render_callback(fb_data); 
// } 

// let fb_data_profile = JSON.parse(localStorage.getItem("fb_data"));

// const fb_id = document.querySelector(".fb-id");
// const fb_name = document.querySelector(".fb-name");
// const fb_email = document.querySelector(".fb-email");
// const fb_pic = document.querySelector(".fb-pic");

// fb_id.innerHTML = `${fb_data_profile.id}`;
// fb_name.innerHTML = `${fb_data_profile.name}`;
// fb_email.innerHTML = `${fb_data_profile.email}`;
// fb_pic.src = `${fb_data_profile.picture}`;
