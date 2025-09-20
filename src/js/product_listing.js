import ProductList from "../js/ProductList.mjs";
import { loadHeaderFooter } from "./utils.mjs";

// load shared header and footer
loadHeaderFooter();

const params = new URLSearchParams(window.location.search);
const category = params.get("category") || "tents";
const listElement = document.querySelector(".product-list");

// 🔑 Update the heading text
const heading = document.querySelector(".products h2");
if (heading) {
  const formatted = category
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  heading.textContent = `Top Products: ${formatted}`;
}

// Render the products
const productList = new ProductList(category, listElement);
productList.init();
