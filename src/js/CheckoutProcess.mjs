import { getLocalStorage } from "./utils.mjs";

export default class CheckoutProcess {
  constructor(key) {
    this.key = key; // localStorage key, e.g., "so-cart"
    this.subtotal = 0;
    this.tax = 0;
    this.shipping = 0;
    this.orderTotal = 0;
  }

  // Calculate and display the subtotal
  calculateItemSummary() {
    const cartItems = getLocalStorage(this.key) || [];
    this.subtotal = 0;

    cartItems.forEach(item => {
      this.subtotal += item.FinalPrice ? item.FinalPrice : item.ListPrice;
    });

    // Update DOM
    document.querySelector("#subtotal").textContent = `$${this.subtotal.toFixed(2)}`;
  }

  // Calculate tax, shipping, and total
  calculateOrderTotal() {
    const cartItems = getLocalStorage(this.key) || [];
    const itemCount = cartItems.length;

    // Tax = 6% of subtotal
    this.tax = this.subtotal * 0.06;

    // Shipping = $10 for first item + $2 for each additional
    this.shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;

    // Total
    this.orderTotal = this.subtotal + this.tax + this.shipping;

    // Update DOM
    document.querySelector("#tax").textContent = `$${this.tax.toFixed(2)}`;
    document.querySelector("#shipping").textContent = `$${this.shipping.toFixed(2)}`;
    document.querySelector("#orderTotal").textContent = `$${this.orderTotal.toFixed(2)}`;
  }
}
