import { alertMessage } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

const checkout = new CheckoutProcess("so-cart");

// Run on page load: calculate summary + totals
checkout.calculateItemSummary();
checkout.calculateOrderTotal();

// Recalculate totals when ZIP changes
const zipInput = document.querySelector("#zip");
if (zipInput) {
  zipInput.addEventListener("blur", () => checkout.calculateOrderTotal());
}

// Handle form submission
const form = document.querySelector("#checkout-form");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // ✅ Validate form
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const order = checkout.buildOrderData(formData);

    if (!expirationIsValid(order.expiration)) {
      alertMessage("Invalid expiration date. Please enter a valid future date.");
      return;
    }

    try {
      const result = await checkout.checkout(order);
      console.log("Order submitted successfully:", result);

      // Clear cart after success
      localStorage.removeItem("so-cart");

      // Redirect
      // Redirect
      window.location.href = "success.html";

      
    } catch (err) {
      console.error("Error submitting order:", err);
      alertMessage(err.message || "There was an issue placing your order. Please try again.");
    }
  });
}

// ================================
// Expiration Date Handling
// ================================
const expDatePicker = document.querySelector("#expDatePicker");
const expDate = document.querySelector("#expDate");
const openCalendar = document.querySelector("#openCalendar");

if (expDatePicker && expDate && openCalendar) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  expDatePicker.min = `${year}-${month}`;

  openCalendar.addEventListener("click", () => {
    expDatePicker.showPicker();
  });

  expDatePicker.addEventListener("change", () => {
    const raw = expDatePicker.value;
    if (raw && raw.includes("-")) {
      const [year, month] = raw.split("-");
      expDate.value = `${month}/${year.slice(-2)}`;
    }
  });

  expDate.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);

    if (value.length >= 3) {
      e.target.value = value.slice(0, 2) + "/" + value.slice(2);
    } else {
      e.target.value = value;
    }
  });
}

// ================================
// Validation Helpers
// ================================

// Luhn Algorithm for credit card validation
function luhnCheck(cardNumber) {
  const digits = cardNumber.replace(/\D/g, "");
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits.charAt(i), 10);
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
}

// Expiration date must be in the future
function expirationIsValid(expVal) {
  if (!expVal) return false;

  if (expVal.includes("-")) {
    // YYYY-MM
    const [y, m] = expVal.split("-");
    const exp = new Date(Number(y), Number(m), 1); // first day next month
    return exp > new Date();
  } else if (expVal.includes("/")) {
    // MM/YY
    const [mm, yy] = expVal.split("/");
    if (!mm || !yy) return false;
    const year = 2000 + Number(yy);
    const month = Number(mm);
    if (month < 1 || month > 12) return false;
    const exp = new Date(year, month, 1); // first day next month
    return exp > new Date();
  }
  return false;
}
