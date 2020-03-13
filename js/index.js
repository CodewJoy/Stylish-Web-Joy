// global variables
let category = window.location.search.split("=")[1];
let next_paging = 0;
// let category = "all";
let isLoading = false;
let url = `https://api.appworks-school.tw/api/1.0/products/${category}`;
let main = document.querySelector('main');

// // send request to load products all page
if (category === undefined) {
    ajax(`https://api.appworks-school.tw/api/1.0/products/all`, function (response) {
        loadPage(response);
        category = "all";
    }); 
} else if (category === "men" || category === "women" || category === "accessories" ) {
    ajax(url, function (response) {
        loadPage(response);
    }); 
} else {
    let keyword = decodeURIComponent(category);
    if (keyword === "") {
        ajax(`https://api.appworks-school.tw/api/1.0/marketing/campaigns`, function (response) {
            marketingCampaigns(response);
        }); 
        let search_result = document.createElement("div"); 
        search_result.className = "search-result";
        search_result.innerHTML = "WE FOUND 0 RESULTS.";
        main.appendChild(search_result);
    } else {
        ajax(`https://api.appworks-school.tw/api/1.0/products/search?keyword=${decodeURIComponent(category)}`, function (response) {
            console.log(response);
            if (response.data.length === 0) {
                ajax(`https://api.appworks-school.tw/api/1.0/marketing/campaigns`, function (response) {
                    marketingCampaigns(response);
                }); 
                let search_result = document.createElement("div"); 
                search_result.className = "search-result";
                search_result.innerHTML = "WE FOUND 0 RESULTS.";
                main.appendChild(search_result);
            } else {
                loadPage(response);
                category = "search";
            }
        }); 
    }
}

// load first page
function loadPage (response) {
    section.innerHTML = "";
    main.innerHTML = "";
    // send request to marketing API
    ajax(`https://api.appworks-school.tw/api/1.0/marketing/campaigns`, function (response) {
        marketingCampaigns(response);
    }); 
    render(response);
}

// render product info 
function render(response) {
    // console.log(response);
    // console.log(typeof(response));

    // store value of next_paging
    next_paging = response.next_paging;

    gallery = document.createElement("DIV"); 
    gallery.className = "gallery";
    main.appendChild(gallery);

    productContainer = document.createElement("DIV"); 
    productContainer.className = "productContainer";
    gallery.appendChild(productContainer);


    let productImageArray = response.data;
    for (let i = 0; i < productImageArray.length; i++) {

        let responsiveBox = [];
        responsiveBox[i] = document.createElement("DIV"); 
        responsiveBox[i].className = "responsiveBox";
        productContainer.appendChild(responsiveBox[i]);

        let productLink = [];
        productLink[i] = document.createElement("A"); 
        productLink[i].className = "productLink";
        responsiveBox[i].appendChild(productLink[i]);

        // render href
        productLink[i].href = `product.html?id=${response.data[i].id}`;

        // render img
        let productImage = [];
        productImage[i] = document.createElement("IMG"); 
        productImage[i].className = "productImage";
        productLink[i].appendChild(productImage[i]);
        productImage[i].src = response.data[i].main_image;
        // render color
        let RectangleColor = [];
        RectangleColor[i] = document.createElement("DIV"); 
        RectangleColor[i].className = "RectangleColor";
        productLink[i].appendChild(RectangleColor[i]);

        colorsArray_API_Length = response.data[i].colors.length;
        for (let j = 0; j < colorsArray_API_Length ; j++) {
            let colorsArray_API = [];
            colorsArray_API[j] = document.createElement("div"); 
            colorsArray_API[j].className = "RectangleColorElement";
            colorsArray_API[j].style.backgroundColor = `#${response.data[i].colors[j].code}`;
            RectangleColor[i].appendChild(colorsArray_API[j]);
        }
        // render title 
        let title = [];
        title[i] = document.createElement("P"); 
        title[i].className = "title";
        productLink[i].appendChild(title[i]);

        let titleArray_API =[];
        titleArray_API[i] = document.createTextNode(response.data[i].title);
        title[i].appendChild(titleArray_API[i]);

        // render price
        let price = [];
        price[i] = document.createElement("P"); 
        price[i].className = "price";
        productLink[i].appendChild(price[i]);
        let priceArray_API =[];
        priceArray_API[i] = document.createTextNode("TWD. "+response.data[i].price);
        price[i].appendChild(priceArray_API[i]);
    }
}

// paging function
function getNextPaging() { 
    const triggerDistance = 50;
    const distance = productContainer.getBoundingClientRect().bottom - window.innerHeight;
    // console.log(distance);
    // console.log(window.innerHeight);
    // console.log(triggerDistance - distance);
    // console.log(category);
    if (next_paging !== undefined) {
        if (!isLoading && distance < triggerDistance) {
            isLoading = true;
            // console.log(`https://api.appworks-school.tw/api/1.0/products/${category}?paging=${next_paging}`);
            ajax(`https://api.appworks-school.tw/api/1.0/products/${category}?paging=${next_paging}`, function (response) {
                isLoading = false;
                render(response);
                // console.log(next_paging);
            }); 
        }
    }     
}

// scroll and call getNextPaging()
window.addEventListener('scroll', () => {getNextPaging()});

// render banner info 
// Marketing Campaigns API
let section = document.querySelector('section');
function marketingCampaigns(response) {
    // console.log(response);
    // console.log(response.data[0]);
    // console.log(response.data[0].id);
    // console.log(response.data[0].picture);
    // console.log(response.data[0].product_id);
    // console.log(response.data[0].story);

    responsiveMainImage = document.createElement("DIV"); 
    responsiveMainImage.className = "responsiveMainImage";
    section.appendChild(responsiveMainImage);
    
    // dot
    dotSet = document.createElement("DIV"); 
    dotSet.className = "dotSet";
    responsiveMainImage.appendChild(dotSet);

    let keyVisualsLink = [];
    let keyVisualsImage = [];
    let story = [];
    let dot = [];
    for (let i = 0; i < response.data.length; i++) {
        keyVisualsLink[i] = document.createElement("A");
        keyVisualsLink[i].className = "keyVisualsLink";
        responsiveMainImage.appendChild(keyVisualsLink[i]);

        keyVisualsImage[i] = document.createElement("DIV");
        keyVisualsImage[i].className = "keyVisualsImage";
        keyVisualsLink[i].appendChild(keyVisualsImage[i]);

        story[i] = document.createElement("DIV");
        story[i].className = "story";     
        keyVisualsLink[i].appendChild(story[i]);

        // render story
        story[i].innerHTML = `${response.data[i].story.replace(/\r\n/g, '<br>')}`;
        // console.log(story[i]);

        // render visual img   
        keyVisualsImage[i].style.backgroundImage = `url("https://api.appworks-school.tw${response.data[i].picture}")`;
        
        // render link
        keyVisualsLink[i].href = `product.html?id=${response.data[i].product_id}`;
    
        // dot
        dot[i] = document.createElement("SPAN");
        dot[i].className = "dot";
        dotSet.appendChild(dot[i]);
        dot[i].onclick = function(){
            currentSlide(i);
        };
    }

    // Slide Effect
    showSlides();
}

// Slide Effect
let slideIndex = 0;
function currentSlide(n) {
    let i;
    let dots = document.getElementsByClassName("dot");
    let keyVisualsLink = document.querySelectorAll('.keyVisualsLink');
    for (i = 0; i < keyVisualsLink.length; i++) {
        keyVisualsLink[i].style.display = "none";  
    }   
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    keyVisualsLink[n].style.display = "flex";  
    dots[n].className += " active";
}
  
function showSlides() {
    let i;
    let dots = document.getElementsByClassName("dot");
    let keyVisualsLink = document.querySelectorAll('.keyVisualsLink');
    for (i = 0; i < keyVisualsLink.length; i++) {
        keyVisualsLink[i].style.display = "none";  
    }
    slideIndex++;
    if (slideIndex > keyVisualsLink.length) {slideIndex = 1;}    
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    keyVisualsLink[slideIndex-1].style.display = "flex";  
    dots[slideIndex-1].className += " active";
    setTimeout(showSlides, 10000); // Change image every 2 seconds
}

// // category page
// const headerLogo = document.querySelector('a.headerLogo');
// function allListener() { 
//     ajax("https://api.appworks-school.tw/api/1.0/products/all", function (response) {
//         loadPage(response);
//         category = "all";
//     }); 
// }

// const womenButton = document.querySelector('a.womenButton');
// function womenListener() { 
//     ajax("https://api.appworks-school.tw/api/1.0/products/women", function (response) {
//         loadPage(response);
//         category = "women";
//     }); 
// }

// const menButton = document.querySelector('a.menButton');
// function menListener() { 
//     ajax("https://api.appworks-school.tw/api/1.0/products/men", function (response) {
//         loadPage(response);
//         category = "men";
//     });
// }
 
// const accessoriesButton = document.querySelector('a.accessoriesButton');
// function accessoriesListener() { 
//     ajax("https://api.appworks-school.tw/api/1.0/products/accessories", function (response) {
//         loadPage(response);
//         category = "accessories";
//     });
// }




