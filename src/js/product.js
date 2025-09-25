import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  // read current cart (null or [] or an old single object) → coerce to array
  const current = getLocalStorage("so-cart");
  const cart = Array.isArray(current) ? current : current ? [current] : [];
  cart.push(product);
  setLocalStorage("so-cart", cart); // save the array
}

async function addToCartHandler(e) {
  e.preventDefault(); // keeps console/logs; no form reload
  const id = e.currentTarget.dataset.id; // safer than e.target
  const product = await dataSource.findProductById(id);
  if (!product) {
    console.log("No product for id", id);
    return;
  }
  addProductToCart(product);
}

document
  .getElementById("addToCart")
  ?.addEventListener("click", addToCartHandler);
