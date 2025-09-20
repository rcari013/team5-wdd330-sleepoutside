import ProductList from "./ProductList.mjs";
import { loadHeaderFooter } from "./utils.mjs";

// load header and footer
loadHeaderFooter();

// product listing
const listElement = document.querySelector(".product-list");
const tentsList = new ProductList("tents", listElement);
tentsList.init();
