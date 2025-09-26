import CheckoutProcess from "./CheckoutProcess.mjs";

const checkout = new CheckoutProcess("so-cart");

// Run when page loads
checkout.calculateItemSummary();
checkout.calculateOrderTotal();

// OPTIONAL: recalc when user enters zip
const zipInput = document.querySelector("#zip");
if (zipInput) {
  zipInput.addEventListener("blur", () => {
    checkout.calculateOrderTotal();
  });
}
