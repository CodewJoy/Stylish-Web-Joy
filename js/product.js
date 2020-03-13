let id = window.location.search.split("=")[1];
// set the picked color & size as global variable temporarily
let variants;
// recorded follow parameters to send to cart
let price_storage;
let name_storage;
let color_storage;
let color_pick;
let size_pick;
let realtime_quantity = 0;
// to control the max value of quantity
let realtime_stock;
// picked the first color & size at first
let pickIndex = 0;


const url = `https://api.appworks-school.tw/api/1.0/products/details?id=${id}`;

// render page & execute functions while pickIndex = 0
ajax(url, function (response) {
    console.log(response);
    render(response);

    // choose the first color & size at first
    pickColor(pickIndex);
    color_pick = fullColorHex (pickColor(pickIndex));
    size_pick = pickSize(pickIndex);
    variants = response.data.variants;
    // actuallly color_pick, size_pick, variants are all global variable
    getStockNum(color_pick, size_pick, variants);
}); 

function render(response) {
    // console.log(response);
    // console.log(response.data.description);

    // get name
    name_storage = response.data.title;
    // get colors array
    color_storage = response.data.colors;

    // render main_image
    let main_image = document.querySelector('.main-image img');
    main_image.src = response.data.main_image;
    
    // render name
    let product_name = document.querySelector('.product-name');
    title = document.createTextNode(response.data.title);
    product_name.appendChild(title);

    // render price
    let product_price = document.querySelector('.product-price');
    let price = document.createTextNode("TWD. "+response.data.price);
    product_price.appendChild(price);

    // recorded the price to send to cart
    price_storage = response.data.price;

    // render id
    let product_id = document.querySelector('.product-id');
    id_text = document.createTextNode(response.data.id);
    product_id.appendChild(id_text);

    // render color
    let color_row = document.querySelector('.color-row');
    for (let i = 0; i < response.data.colors.length; i++) {
        let colorsArray = [];
        colorsArray[i] = document.createElement("div"); 
        colorsArray[i].className = "clothColor";
        colorsArray[i].style.backgroundColor = `#${response.data.colors[i].code}`;
        
        // console.log(colorsArray[i].style.backgroundColor);
        // console.log(response.data.colors[i].code);

        // add onclick functions to colorDiv
        colorsArray[i].onclick = function(){ 
            pickColor(i);
            color_pick = fullColorHex (pickColor(i));

            // check the parameter
            getStockNum(color_pick, size_pick, variants);
        };
        color_row.appendChild(colorsArray[i]);
    }
    // render size
    let size_row = document.querySelector('.size-row');
    for (let i = 0; i < response.data.sizes.length; i++) {
        let sizeArray = [];
        sizeArray[i] = document.createElement("div"); 
        sizeArray[i].className = "size";
        // sizeArray[i].className += ` ${response.data.sizes[i]}`;
        let size_text = [];
        size_text[i] = document.createTextNode(response.data.sizes[i]);
        sizeArray[i].appendChild(size_text[i]);
        
        // add onclick functions to sizeDiv
        sizeArray[i].onclick = function(){
            size_pick = pickSize(i);
            getStockNum(color_pick, size_pick, variants);
        };

        size_row.appendChild(sizeArray[i]);
    }

    // render content
    let content= document.querySelector('.content');
    let note = document.createTextNode(response.data.note);
    content.appendChild(note);

    let br = document.createElement("BR")
    content.appendChild(br);

    let texture = document.createTextNode(response.data.texture);
    content.appendChild(texture);
    let br1 = br.cloneNode(true);

    content.appendChild(br1);
    description = document.createElement("SPAN");   
    content.appendChild(description);
    description.innerHTML = `${response.data.description.replace(/\r\n/g, '<br>')}`;

    let br2 = br.cloneNode(true);
    content.appendChild(br2);
    let place = document.createTextNode("素材產地 / "+response.data.place);
    content.appendChild(place);
    let place2 = document.createTextNode("加工產地 / "+response.data.place);
    let br3 = br.cloneNode(true);
    content.appendChild(br3);
    content.appendChild(place2);

    // render product description
    let product_description = document.querySelector('.product-description');
    let des = document.createElement("p"); 
    let story = document.createTextNode(response.data.story);
    product_description.appendChild(des);
    des.appendChild(story);
   
    // render images
    let images = document.querySelectorAll('.product-image img');
    images[0].src = response.data.images[0];
    images[1].src = response.data.images[1];

    console.log(response.data.variants);
}

// change the appearance of picked clolor div
// return the value of choosed color, data type: "rgb(221, 255, 187)"
function pickColor(pickIndex) {
    let i;
    let color = document.querySelectorAll(".clothColor");
    for (i = 0; i < color.length; i++) {
        color[i].className = color[i].className.replace("color-pick", "");
    }
    color[pickIndex].className += " color-pick";

    // recover the quantity to 1
    document.querySelector('.input-number').value = 0;
    realtime_quantity = 0;

    // color : rgb(187, 119, 68)
    return color[pickIndex].style.backgroundColor;
}
// change the appearance of picked size div 
// return the value of choosed size, data type: "S"
function pickSize(pickIndex) {
    let i;
    let size = document.querySelectorAll(".size");
    for (i = 0; i < size.length; i++) {
        size[i].className = size[i].className.replace("size-pick", "");
    }
    size[pickIndex].className += " size-pick";

    // recover the quantity to 1
    document.querySelector('.input-number').value = 0;
    realtime_quantity = 0;

    return size[pickIndex].textContent;
}

// turns color data type from "rgb(221, 255, 187)" to "DDFFBB"
let rgbToHex2 = (r, g, b) => [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
}).join('').toUpperCase()

let fullColorHex = function(rgb) {  
    let memory = rgb.split(",");
    let r = Number(memory[0].split("(")[1]); 
    let g = Number(memory[1].replace(" ",""));
    let b = Number(memory[2].replace(" ","").replace(")",""));
    // console.log(r);
    // console.log(g);
    // console.log(b);
    return rgbToHex2(r,g,b);
};

// button to add & minus the value
function add_num() {
    let input_number = Number(document.querySelector('.input-number').value);
    if (input_number < realtime_stock) {
        input_number += 1;
        document.querySelector('.input-number').value = input_number;
        realtime_quantity = input_number;
    } else {
        document.querySelector('.input-number').value = realtime_stock;
        realtime_quantity = realtime_stock;
        alert("已經超過單品購買上限"); 
    }
}
function minus_num() {
    let input_number = Number(document.querySelector('.input-number').value);
    if (input_number > 0 ) {
        input_number -= 1;
        document.querySelector('.input-number').value = input_number;
        realtime_quantity = input_number;
    } else {
        document.querySelector('.input-number').value = 0;     
        realtime_quantity = 0;  
    }
}

// control the quatity ranges from 1 to realtime_stock 
// control the quatity is positive integer
function positiveNumber(event) {
    let input_number = Number(document.querySelector('.input-number').value);
    if(event.keyCode === 13){
        let r = /^[0-9]*[1-9][0-9]*$/   
        if (input_number === undefined || input_number === "") {
            document.querySelector('.input-number').value = 0;
            realtime_quantity = 0;
            alert("請輸入正整數作為購買數量，感謝您！");
        } else {
            if(r.test(input_number) === true) { // to justify positive integer or not
                if (input_number <= realtime_stock) {
                    document.querySelector('.input-number').value = input_number;
                    realtime_quantity = input_number;
                } else {
                    document.querySelector('.input-number').value = realtime_stock;
                    alert("已經超過單品購買上限"); 
                    realtime_quantity = realtime_stock;
                }
            } else {
                alert("請輸入正整數作為購買數量，感謝您！");
                document.querySelector('.input-number').value = 0;
                realtime_quantity = 0;
            }
        }
    }
}

// input color & size, get realtime_stock
// color data type: "DDFFBB" string; size data type: "S" string
function getStockNum(color, size, variants) {
    for (let i = 0; i < variants.length; i++) {
        if (color === variants[i].color_code && size === variants[i].size) {
            console.log(variants[i].stock);
            realtime_stock = variants[i].stock;
            return realtime_stock;
        }
    }
}

// find the corresponding name of color
function getNameOfColor(code) {
    for (let i = 0; i < color_storage.length; i++) {
        if (code === color_storage[i].code) {
            return color_storage[i].name;
        }
    }
}

// when enter new product page, get prior localStorage data if any
// use Logical OR: if JSON.parse(localStorage.getItem("cart")) is true, return it; 
// if localStorage.getItem("cart") is null, return ""
let order_form = JSON.parse(localStorage.getItem("cart")) || "";

// if order_buy is "", need to define order's data type, or cannot push data into order.list array
if (order_form === "") {
    order_form = {
        prime: "primekey",
        order: {
            shipping: 'delivery',
            payment: 'credit-card',
            subtotal: 'price-excluded-freight-fee',
            freight: 'freight-fee',
            total: 'final-price',
            recipient: {
                name: "name",
                phone: "phone",
                email: "email",
                address: "post-address",
                time: "morning"|"afternoon"|"anytime"
            }
        },
        list: [
            // {
            //     "id": [Product ID],
            //     "name": [Product Name],
            //     "price": [Product Unit Price],
            //     "color": {
            //       "name": [Product Variant Color Name],
            //       "code": [Product Variant Color HexCode]
            //     },
            //     "size": [Product Variant Size],
            //     "qty": [Quantity]
            // },
            //   ...
        ]
    };
    // order_form = {};
    // order_form.list = [];
}

// add to cart function
function add_to_cart() {
    if (realtime_stock !== 0) {
        if (realtime_quantity === 0) {
            console.log(realtime_stock);
            alert("請輸入正整數作為購買數量，感謝您！");
        } else {
            let obj_buy = {
                "id": id,
                "name": name_storage,
                "price": price_storage,
                "color": {
                    "name": getNameOfColor(color_pick),
                    "code": color_pick
                },
                "size": size_pick,
                "qty": realtime_quantity,
                // for checkout page to use
                "stock": realtime_stock
            };
            console.log(obj_buy);

            // deduct realtime_quantity in realtime_stock
            for (let i = 0; i < variants.length; i++) {
                if (color_pick === variants[i].color_code && size_pick === variants[i].size) {
                    variants[i].stock -= realtime_quantity;
                    // realtime_quantity -= realtime_quantity;
                    realtime_stock = variants[i].stock;
                }
            }
            console.log(realtime_stock);
            console.log(variants); 
            
            // recover the quantity to 0
            document.querySelector('.input-number').value = 0;
            realtime_quantity = 0;
            
            // for obj_buy object, search in localStorage data to find if the id & color & size of order is repeated 
            // if repeated, merge the order (add the qty in the same item'order at localStorage)
            if (order_form !== "") {
                for (let i = 0; i < order_form.list.length; i++) {
                    if (obj_buy.id === order_form.list[i].id && obj_buy.color.code === order_form.list[i].color.code && obj_buy.size === order_form.list[i].size) {
                        order_form.list[i].qty += obj_buy.qty;
                        obj_buy.qty = 0;
                        localStorage.setItem('cart', JSON.stringify(order_form));
                    }
                }  
            }
            // if not repeated, update the data & store it in localStorage
            if (obj_buy.qty !== 0) {
                // update the order_buy obj
                order_form.list.push(obj_buy);
                // save latest shopping cart data back to localStorage
                localStorage.setItem('cart', JSON.stringify(order_form));
            }
            
            // adjust cart data
            reloadQty();

            // checkSizeStock(color_pick);
            alert("已加入購物車");
            return obj_buy;
        } 
    } else {
        alert("加入購物車未成功，商品已無庫存");
    }
}