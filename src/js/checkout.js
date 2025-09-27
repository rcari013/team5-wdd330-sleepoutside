import CheckoutProcess from "./CheckoutProcess.mjs";
import ExternalServices from "./ExternalServices.mjs";

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

// Handle form submission
const form = document.querySelector("#checkout-form");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Build order object
    const formData = new FormData(form);
    const order = checkout.buildOrderData(formData);

    try {
      // Send order to backend
      const services = new ExternalServices();
      const result = await services.checkout(order);

      console.log("Order submitted successfully:", result);

      // For now: simple confirmation message
      alert("Order placed successfully! 🎉");

      // Clear cart from localStorage
      localStorage.removeItem("so-cart");

      // Redirect to thank-you page (optional)
      // window.location.href = "/checkout/confirmation.html";

    } catch (err) {
      console.error("Error submitting order:", err);
      alert("There was an issue placing your order. Please try again.");
    }
  });
}
