// src/js/ShoppingCart.mjs
import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ShoppingCart {
  constructor(key, listElement) {
    this.key = key; // e.g., "so-cart"
    this.listElement = listElement;
  }

  init() {
    const cartItems = getLocalStorage(this.key) || [];
    this.renderCartContents(cartItems);
  }

  renderCartContents(cartItems) {
    if (!cartItems.length) {
      this.listElement.innerHTML = "<p>Your cart is empty.</p>";
      this.showCartTotal([]);
      return;
    }

    const htmlItems = cartItems.map((item) => this.cartItemTemplate(item));
    this.listElement.innerHTML = htmlItems.join("");

    // Attach remove button listeners after rendering
    this.attachRemoveListeners();

    this.showCartTotal(cartItems);
  }

cartItemTemplate(item) {
  const image =
    item.Images?.PrimaryMedium ||
    item.Images?.PrimaryLarge ||
    item.Image ||
    item.image ||
    item.ImageUrl ||
    "/images/placeholder.png";

  return `<li class="cart-card divider">
    <a href="/product_pages/index.html?product=${item.Id}" class="cart-card__image">
      <img src="${image}" alt="${item.Name}" />
    </a>
    <a href="/product_pages/index.html?product=${item.Id}">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    ${item.Colors?.[0]?.ColorName ? `<p class="cart-card__color">${item.Colors[0].ColorName}</p>` : ""}
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${item.FinalPrice.toFixed(2)}</p>
    <button class="remove-item" data-id="${item.Id}">&times;</button>
  </li>`;
}


  attachRemoveListeners() {
    const buttons = this.listElement.querySelectorAll(".remove-item");
    buttons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        this.removeItem(id);
      });
    });
  }

  removeItem(id) {
    let cartItems = getLocalStorage(this.key) || [];
    // filter out the clicked item
    cartItems = cartItems.filter((item) => item.Id != id);
    // save back to localStorage
    setLocalStorage(this.key, cartItems);
    // re-render
    this.renderCartContents(cartItems);
  }

  showCartTotal(cartItems) {
    const footer = document.querySelector(".cart-footer");
    const totalElement = document.querySelector(".cart-total");

    if (cartItems.length > 0) {
      footer.classList.remove("hide");
      const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);
      totalElement.textContent = `Total: $${total.toFixed(2)}`;
    } else {
      footer.classList.add("hide");
    }
  }
}
