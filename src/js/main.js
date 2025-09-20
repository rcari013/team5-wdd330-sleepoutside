import ProductList from "./ProductList.mjs";
import { loadHeaderFooter } from "./utils.mjs";

// load header and footer
loadHeaderFooter();

// product listing (only if .product-list exists on the page)
const listElement = document.querySelector(".product-list");
if (listElement) {
  const tentsList = new ProductList("tents", listElement);
  tentsList.init();
}
