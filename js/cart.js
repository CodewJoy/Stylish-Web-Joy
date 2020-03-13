let order_form = JSON.parse(localStorage.getItem("cart")) || "";
let cart_order_amount;
if (order_form === "") {
    cart_order_amount = 0;
} else {
    cart_order_amount = order_form.list.length;
}

render_product();

// create a element & give it class name
// data type: "DIV", "class name"
function create_node(ele_tag, class_name) {
    ele_tag = document.createElement(ele_tag);
    ele_tag.className = class_name;
    return ele_tag;
}

// create BR element
function createBR() {
    const br = document.createElement("BR");
    return br;
}
function createHR() {
    const hr = document.createElement("HR");
    return hr;
}

// create order_form element 
function createSelectOption(select_classname, stock, qty, option_classname) {
    const select = document.createElement("SELECT");
    select.className = select_classname;
    for (let j = 0; j < stock; j++) {
        let option = create_node("OPTION", option_classname);
        option.value = `${j + 1}`;
        option.append(`${j + 1}`);
        if (j === (qty - 1)) {
            option.selected = true;
            console.log(option);
        }
        select.append(option);
    }
    return select;
}

// render product order if order !== 0
function render_product() {
    const cart = document.querySelector(".cart");
    cart.innerHTML = "";
    if (cart_order_amount === 0) {
        const order_zero = create_node("DIV", "order-zero");
        order_zero.append("YOUR BAG IS EMPTY.");
        cart.append(order_zero);
        render_price();
    } else {
        // create node of row
        for (let i = 0; i < cart_order_amount; i++) {
            const row = create_node("DIV", "row");
            const variant = create_node("DIV", "variant");
            const calculate_web = create_node("DIV", "calculate-web");
            const remove_wrap = create_node("DIV", "remove-wrap");
            const calculate = create_node("DIV", "calculate");

            const picture_wrap = create_node("DIV", "picture-wrap");
            const picture = create_node("IMG", "picture");
            const remove = create_node("IMG", "remove");

            const detail = create_node("DIV", "detail");

            const select_qty_web = create_node("DIV", "select-qty-web");
            const select_qty = create_node("DIV", "select-qty");

            const hr_divider = create_node("HR", "divider");
            cart.append(row);
            // make hr divider
            if (i !== cart_order_amount - 1) {
                cart.append(hr_divider);
            }
            row.append(variant, calculate_web, remove_wrap, calculate);

            variant.append(picture_wrap, detail);
            picture_wrap.append(picture);
            remove_wrap.append(remove);

            select_qty_web.append("數量", createBR(), createSelectOption("select-web", order_form.list[i].stock, order_form.list[i].qty, "option-web"));
            select_qty.append("數量", createBR(), createSelectOption("select-mobile", order_form.list[i].stock, order_form.list[i].qty, "option"));

            calculate_web.append(select_qty_web);
            calculate.append(select_qty);

            const price_web = create_node("DIV", "price-web");
            const price = create_node("DIV", "price");
            price_web.append("單價", createBR(), "NT.", order_form.list[i].price);
            price.append("單價", createBR(), "NT.", order_form.list[i].price);
            calculate_web.append(price_web);
            calculate.append(price);

            const subtotal_web = create_node("DIV", "subtotal-web");
            const subtotal = create_node("DIV", "subtotal");
            calculate_web.append(subtotal_web);
            calculate.append(subtotal);


            const subtotal_web_num = create_node("SPAN", "subtotal-web-num");
            const subtotal_num = create_node("SPAN", "subtotal-num");
            subtotal_web_num.append(order_form.list[i].price * order_form.list[i].qty);
            subtotal_num.append(order_form.list[i].price * order_form.list[i].qty);

            subtotal_web.append("小計", createBR(), "NT.", subtotal_web_num);
            subtotal.append("小計", createBR(), "NT.", subtotal_num);
        }
        // select element to load data
        const picture = document.querySelectorAll(".picture");
        const detail = document.querySelectorAll(".detail");
        const remove = document.querySelectorAll(".remove");
        for (let i = 0; i < cart_order_amount; i++) {
            // render img
            picture[i].src = `https://api.appworks-school.tw/assets/${order_form.list[i].id}/main.jpg`;

            // render detail
            detail[i].append(order_form.list[i].name, createBR(), order_form.list[i].id, createBR(), createBR(), "顏色：", order_form.list[i].color.name, createBR(), "尺寸：", order_form.list[i].size);

            // render remove
            remove[i].src = "img/cart-remove.png";
        }
        render_price();
        change_item();
        remove_item();
    }
}

function render_price() {
    const total_amount_number = document.querySelector(".total-amount-number span");
    const fare_number = document.querySelector(".fare-number span");
    const payable_amount_number = document.querySelector(".payable-amount-number span");
    // let subtotal_web_num = document.querySelectorAll(".subtotal-web-num");
    // let subtotal_num = document.querySelectorAll(".subtotal-num");
    if (cart_order_amount !== 0) {
        let total = 0;
        for (let i = 0; i < cart_order_amount; i++) {
            total += order_form.list[i].price * order_form.list[i].qty;
            console.log(total);
        }
        total_amount_number.innerText = `${total}`;
        payable_amount_number.innerText = `${total + 60}`;
    } else {
        total_amount_number.innerText = 0;
        fare_number.innerText = 0;
        payable_amount_number.innerText = 0;
    }
}
// another method
// function render_price() {
//     const total_amount_number = document.querySelector(".total-amount-number span");
//     // const fare_number = document.querySelector(".fare-number span");
//     const payable_amount_number = document.querySelector(".payable-amount-number span");
//     let subtotal_web_num = document.querySelectorAll(".subtotal-web-num");
//     // let subtotal_num = document.querySelectorAll(".subtotal-num");
//     let total = 0;
//     for (let i=0; i < cart_order_amount; i++) {
//         total += Number(subtotal_web_num[i].innerText);
//         console.log(total);
//     }
//     total_amount_number.innerText = `${total}`;
//     payable_amount_number.innerText = `${total+60}`;
// }

// modify quantity
function change_item() {
    const select_web = document.querySelectorAll(".select-web");
    const select_mobile = document.querySelectorAll(".select-mobile");
    let subtotal_web_num = document.querySelectorAll(".subtotal-web-num");
    let subtotal_mobile_num = document.querySelectorAll(".subtotal-num");
    for (let i = 0; i < cart_order_amount; i++) {
        select_web[i].addEventListener("change", () => {
            // console.log(select_web[i].options.selectedIndex+1, i);

            // change order_form data
            order_form.list[i].qty = select_web[i].options.selectedIndex + 1;
            // change localStorage data
            localStorage.setItem('cart', JSON.stringify(order_form));
            // change the subtotal on the webpage
            subtotal_web_num[i].innerText = order_form.list[i].qty * order_form.list[i].price;
            // change the mobile qty & subtotal
            select_mobile[i].options.selectedIndex = order_form.list[i].qty - 1;
            subtotal_mobile_num[i].innerText = order_form.list[i].qty * order_form.list[i].price;

            render_price();
        });
        select_mobile[i].addEventListener("change", () => {
            // console.log(select_mobile[i].options.selectedIndex+1, i);

            // change order_form data
            order_form.list[i].qty = select_mobile[i].options.selectedIndex + 1;
            // change localStorage data
            localStorage.setItem('cart', JSON.stringify(order_form));
            // change the subtotal on the webpage
            subtotal_mobile_num[i].innerText = order_form.list[i].qty * order_form.list[i].price;
            // change the web qty & subtotal
            select_web[i].options.selectedIndex = order_form.list[i].qty - 1;
            subtotal_web_num[i].innerText = order_form.list[i].qty * order_form.list[i].price;
            // rerender price
            render_price();
        });
    }
}

function remove_item() {
    const remove = document.querySelectorAll(".remove");
    for (let i = 0; i < cart_order_amount; i++) {
        remove[i].addEventListener("click", () => {
            alert("已從購物車移除");
            // change order_form data, delete ith element in array
            order_form.list.splice(i, 1);
            console.log(order_form)
            // change localStorage data
            localStorage.setItem('cart', JSON.stringify(order_form));
            // change the global varible 
            cart_order_amount = order_form.list.length;

            // adjust cart data
            reloadQty();
            // console.log(order_form);
            // console.log(order_form.list);
            // console.log(cart_order_amount);

            render_product();
        });
    }
}

//when have time, 
// // input id, color & size, get realtime_stock
// // color data type: "DDFFBB" string; size data type: "S" string
// function getStockNum(id, color, size) {
//     const url = `https://api.appworks-school.tw/api/1.0/products/details?id=${id}`;
//     ajax(url, function (response) {
//         console.log(response);
//         for (let i = 0; i < response.data.variants.length; i++) {
//             if (color === response.data.variants[i].color_code && size === response.data.variants[i].size) {
//                 return response.data.variants[i].stock;
//             }
//         }
//     }); 
// }

let header_value = {};
window.fbAsyncInit = function() {
    FB.init({
      appId      : '456322688611105',
      cookie     : true,                     // Enable cookies to allow the server to access the session.
      xfbml      : true,                     // Parse social plugins on this webpage.
      version    : 'v5.0'          // Use this Graph API version for this call.
    });
    FB.getLoginStatus(function(response) {   // Called after the JS SDK has been initialized.
        if (response.status === 'connected') {
            console.log(response);
            console.log(response.authResponse);
            console.log(response.authResponse.accessToken);
            let token = response.authResponse.accessToken;
            header_value = {
                'content-type': 'application/json',
                'Authorization': "Bearer "+`${token}`
            };
            console.log(header_value);         
        } else {
            console.log(response);
            header_value = {
                'content-type': 'application/json',
            }; 
            console.log(header_value);         
        }       
    });
}

// TapPay Fields - v4
let check_to_pay = document.querySelector('.check-to-pay');
TPDirect.card.setup({
    fields: {
        number: {
            // css selector
            element: '#card-number',
            placeholder: '**** **** **** ****'
        },
        expirationDate: {
            // DOM object
            element: document.getElementById('card-expiration-date'),
            placeholder: 'MM / YY'
        },
        ccv: {
            element: '#card-ccv',
            placeholder: 'CCV'
        }
    },
    styles: {
        // Style all elements
        'input': {
            'color': 'gray'
        },
        // Styling ccv field
        'input.cvc': {
            // 'font-size': '16px'
        },
        // Styling expiration-date field
        'input.expiration-date': {
            // 'font-size': '16px'
        },
        // Styling card-number field
        'input.card-number': {
            // 'font-size': '16px'
        },
        // style focus state
        ':focus': {
            // 'color': 'black'
        },
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    }
});


TPDirect.card.onUpdate(function (update) {
    update.canGetPrime === true
    // --> you can call TPDirect.card.getPrime()
    if (update.canGetPrime) {
        // Enable submit Button to get prime.
        check_to_pay.removeAttribute('disabled')
    } else {
        // Disable submit Button to get prime.
        check_to_pay.setAttribute('disabled', true)
    }

    // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unknown']
    if (update.cardType === 'visa') {
        // Handle card type visa.
    }

    // number 欄位是錯誤的
    if (update.status.number === 2) {
        // setNumberFormGroupToError();
    } else if (update.status.number === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }

    if (update.status.expiry === 2) {
        // setNumberFormGroupToError();
    } else if (update.status.expiry === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }

    if (update.status.cvc === 2) {
        // setNumberFormGroupToError();
    } else if (update.status.cvc === 0) {
        // setNumberFormGroupToSuccess();
    } else {
        // setNumberFormGroupToNormal();
    }
});

TPDirect.card.getTappayFieldsStatus();
// TPDirect.card.getPrime(callback);

// call TPDirect.card.getPrime when user submit form to get tappay prime
// $('form').on('submit', onSubmit);

function onSubmit(event) {
    event.preventDefault()

    // confirm the billing infomation
    const recipient_name = document.getElementById("recipient-name");
    const recipient_email = document.getElementById("recipient-email");
    const recipient_phone = document.getElementById("recipient-phone");
    const recipient_address = document.getElementById("recipient-address");

    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()

    // check the order num > 0
    if (cart_order_amount === 0) {
        alert("購物清單中沒有商品，歡迎繼續選購，謝謝！");
        return
    } else {
        // check recipient-name
        if (recipient_name.value === "") {
            alert("您尚未輸入收件人姓名");
            return
        } else {
            // check recipient-email
            if (recipient_email.value === "") {
                alert("您尚未輸入Email");
                return
            } else {
                // check recipient-phone
                if (recipient_phone.value === "") {
                    alert("您尚未輸入手機號碼");
                    return
                } else {
                    // check recipient-address
                    if (recipient_address.value === "") {
                        alert("您尚未輸入收件地址");
                        return
                    } else {
                        // 確認是否可以 getPrime
                        if (tappayStatus.canGetPrime === false) {
                            alert('信用卡未填寫或資訊填寫錯誤')
                            return
                        }
                    }
                }
            }
        }
    }

    // Get prime
    TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {
            alert('get prime error ' + result.msg)
            return
        }
        // alert('get prime 成功，prime: ' + result.card.prime);
        collectData();
        
        // update prime info in data packaged
        data.prime = result.card.prime;
        console.log(data);
        // connect to check out API
        postData(url, data);
        // send prime to your server, to pay with Pay by Prime API .
        // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
    })

};

// 如果有綁定卡片欲開啟偽卡偵測功能，請使用此方法取得 fraud id ，並在呼叫 Pay by Token 時帶入 fraud id
// TPDirect.getFraudId();

// package data to pass to checkout API
let data;
function collectData() {
    const subtotal = document.querySelector(".total-amount-number span");
    const freight = document.querySelector(".fare-number span");
    const total = document.querySelector(".payable-amount-number span");

    const recipient_name = document.getElementById("recipient-name");
    const recipient_email = document.getElementById("recipient-email");
    const recipient_phone = document.getElementById("recipient-phone");
    const recipient_address = document.getElementById("recipient-address");
    const recipient_time = document.getElementsByName("recipient-time");
    let time;

    // to find the recipient time chosen
    for (let i = 0; i < recipient_time.length; i++) {
        if (recipient_time[i].checked === true) {
            time = recipient_time[i].value;
        }
    }

    // delete stock number in copied locatstorage data
    let copy = Object.assign({}, order_form);
    for (let i = 0; i < cart_order_amount; i++) {
        delete copy.list[i].stock;
    }
    // make checkout json object
    // for stock issue & list data structure issue, remake the data
    data = {
        prime: "primekey",
        order: {
            shipping: 'delivery',
            payment: 'credit-card',
            subtotal: subtotal.innerText,
            freight: freight.innerText,
            total: total.innerText,
            recipient: {
                name: recipient_name.value,
                //"Luke",
                phone: recipient_phone.value,
                //"0987654321",
                email: recipient_email.value,
                //"luke@gmail.com",
                address: recipient_address.value,
                //"市政府站",
                time: time
                //"morning"
            },
            list: copy.list
        }
    }
}

(function(d, s, id) {                      // Load the SDK asynchronously
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));


// connect to check out API
const url = "https://api.appworks-school.tw/api/1.0/order/checkout";
function postData(url, data) {
    // Default options are marked with *
    return fetch(url, {
        body: JSON.stringify(data), // must match 'Content-Type' header
        headers: header_value, // get header_value
        method: 'POST'// *GET, POST, PUT, DELETE, etc.
    })
    // get check out result from check out API
    .then(response => response.json()) // 輸出成 json
    .then(response => {
        console.log(response);
        // more than 1 localStorage data, cannot use localStorage.clear()
        localStorage.removeItem("cart");
         window.location.href = `thankyou.html?number=${response.data.number}`;
    })
}

