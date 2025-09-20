// productDetails.js
import { loadHeaderFooter } from "./utils.mjs";
import { renderProductDetails } from "./ProductDetails.mjs";

// Load header/footer
loadHeaderFooter();

// Grab product id from query string
const params = new URLSearchParams(window.location.search);
const productId = params.get("product");

// Render product
const container = document.querySelector("#product-details");
renderProductDetails(productId, container);
