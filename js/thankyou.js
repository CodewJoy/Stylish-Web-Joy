let number = window.location.search.split("=")[1];
const purchase_number = document.querySelector(".purchase-number");
purchase_number.innerHTML = `${number}`;

