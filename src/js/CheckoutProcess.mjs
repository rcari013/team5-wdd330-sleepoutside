import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

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

    const subtotalEl = document.querySelector("#subtotal");
    if (subtotalEl) {
      subtotalEl.textContent = `$${this.subtotal.toFixed(2)}`;
    }
  }

  // Calculate tax, shipping, and total
  calculateOrderTotal() {
    const cartItems = getLocalStorage(this.key) || [];
    const itemCount = cartItems.length;

    this.tax = this.subtotal * 0.06;
    this.shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;
    this.orderTotal = this.subtotal + this.tax + this.shipping;

    const taxEl = document.querySelector("#tax");
    const shippingEl = document.querySelector("#shipping");
    const totalEl = document.querySelector("#orderTotal");

    if (taxEl) taxEl.textContent = `$${this.tax.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = `$${this.shipping.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${this.orderTotal.toFixed(2)}`;
  }

  // Package cart items for order
  packageItems() {
    const cartItems = getLocalStorage(this.key) || [];
    return cartItems.map(item => ({
      id: item.Id,
      name: item.Name,
      price: item.FinalPrice ? item.FinalPrice : item.ListPrice,
      quantity: 1
    }));
  }

  buildOrderData(formData) {
    let expRaw = formData.get("expDate");
    let expFormatted = "";

    if (expRaw) {
      if (expRaw.includes("-")) {
        const [year, month] = expRaw.split("-");
        expFormatted = `${month}/${year.slice(-2)}`;
      } else if (expRaw.includes("/")) {
        expFormatted = expRaw;
      }
    }

    return {
      orderDate: new Date().toISOString(),
      fname: formData.get("firstName"),
      lname: formData.get("lastName"),
      street: formData.get("street"),
      city: formData.get("city"),
      state: formData.get("state"),
      zip: formData.get("zip"),
      cardNumber: formData.get("cardNumber"),
      expiration: expFormatted,
      code: formData.get("securityCode"),
      items: this.packageItems(),
      orderTotal: this.orderTotal.toFixed(2),
      shipping: this.shipping.toFixed(2),
      tax: this.tax.toFixed(2)
    };
  }

  async checkout(order) {
    const services = new ExternalServices();
    try {
      const result = await services.checkout(order);
      return result;
    } catch (err) {
      console.error("Checkout failed:", err);
      throw new Error("We could not process your order. Please check your details and try again.");
    }
  }
}
