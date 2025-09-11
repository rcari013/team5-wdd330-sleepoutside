import ProductList from "./ProductList.mjs";

const listElement = document.querySelector(".product-list");
const tentsList = new ProductList("tents", listElement);

tentsList.init();
