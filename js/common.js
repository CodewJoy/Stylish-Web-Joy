// send request & get response
function ajax(src, callback) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let response = this.responseText; // this.responseText is in JSON string type
            return callback(JSON.parse(response)); // turn data type from JOSN string into JS object 
        }
    }
    xhttp.open("GET", src, true);
    xhttp.send();
}

// get current shopping cart data from localStorage in every page
localStorage.getItem('cart') ;

reloadQty();
// adjust cart qty on the header, get the qty from localStorage.cart
function reloadQty() {
    let qty = document.querySelectorAll('.qty');
    if (localStorage.length === 0) {
        for (let i = 0; i < qty.length; i++) {
            qty[i].innerHTML = 0;
        }
    } else {
        if (localStorage.cart === undefined) {
            for (let i = 0; i < qty.length; i++) {
                qty[i].innerHTML = 0;
            }
        } else {    
            for (let i = 0; i < qty.length; i++) {
                qty[i].innerHTML = `${JSON.parse(localStorage.cart).list.length}` || 0;
            }
        }
    }
}

// FB login
let member_web = document.querySelector(".member_web");
let member_mobile = document.querySelector(".member_mobile img");

member_web.addEventListener("click", () => {checkLoginState()});
member_mobile.addEventListener("click", () => {checkLoginState()});

window.fbAsyncInit = function() {
    FB.init({
      appId      : '456322688611105',
      cookie     : true,                     // Enable cookies to allow the server to access the session.
      xfbml      : true,                     // Parse social plugins on this webpage.
      version    : 'v5.0'          // Use this Graph API version for this call.
    });
    // FB.getLoginStatus(function(response) {   // Called after the JS SDK has been initialized.
    //   statusChangeCallback(response);        // Returns the login status.
    // });
};

(function(d, s, id) {                      // Load the SDK asynchronously
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

// function statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
//     console.log('statusChangeCallback');
//     console.log(response);                   // The current login status of the person.
//     if (response.status === 'connected') {   // Logged into your webpage and Facebook.
//       testAPI();  
//     } else {                                 // Not logged into your webpage or we are unable to tell.
//         console.log("您尚未登入FB會員身份");
//     }
// }

// rewrite
function checkLoginState() {               // Called when a person is finished with the Login Button.
    FB.getLoginStatus(function(response) {   // Called after the JS SDK has been initialized.
        if (window.location.href !== "profile.html") {
            if (response.status === 'connected') {
                console.log("connected");
                console.log(response);
                console.log(response.authResponse);
                console.log(response.authResponse.accessToken);
                window.location.href = "profile.html";
            } else {
                FB.login(function(response) {
                    if (response.status === 'connected') {
                        if (window.location.href !== "profile.html") {
                            window.location.href = "profile.html";
                        }
                    } else {
                        alert("您尚未登入FB會員");
                    }
                });
            }
        }
    },{scope: 'public_profile,email'});
}

// search function
// need to fix if have time : search?keyword=洋裝&paging=1 
let searchDescription = document.querySelector('input.searchDescription');
let btnSearch_web = document.querySelector('img.btnSearch_web');
let searchDescription_mobile = document.querySelector('.searchDescription-mobile');
let btnSearch_mobile = document.querySelector('img.btnSearch_mobile');

function searchListener() { 
    // if (searchDescription.value)
    console.log(encodeURIComponent(searchDescription.value));
    window.location.href = `./?keyword=${encodeURIComponent(searchDescription.value)}`;
}
function searchListener_mobile() {
    let btnSearch_mobile = document.querySelector('img.btnSearch_mobile');
    let mobile_search_shown = document.querySelector('.mobile-search-shown');
    btnSearch_mobile.style.display = "flex";
    mobile_search_shown.style.display = "none";
    console.log(encodeURIComponent(searchDescription_mobile.value));
    window.location.href = `./?keyword=${encodeURIComponent(searchDescription_mobile.value)}`;
}

// web
searchDescription.addEventListener("keyup", function(event){
    if(event.keyCode === 13){
        searchListener();
    }
})

btnSearch_web.addEventListener("click", function(){
    searchListener();
})

function show_mobile_search() {
    let btnSearch_mobile = document.querySelector('img.btnSearch_mobile');
    let mobile_search_shown = document.querySelector('.mobile-search-shown');
    btnSearch_mobile.style.display = "none";
    mobile_search_shown.style.display = "flex";
}

// mobile
// onclick="show_mobile_search()"
btnSearch_mobile.addEventListener("click", function(){
    show_mobile_search(); 
    add_listener_mobile();
})
function add_listener_mobile() {
    let btnSearch_mobile_shown = document.querySelector('.btnSearch-mobile-shown');
    btnSearch_mobile_shown.addEventListener("click", function(){
        searchListener_mobile();
    })
    let searchDescription_mobile = document.querySelector('.searchDescription-mobile');
    searchDescription_mobile.addEventListener("keyup", function(event){
        if(event.keyCode === 13){
            searchListener_mobile();
        }
    })  
}