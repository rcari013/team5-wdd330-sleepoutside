import { alertMessage } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

const checkout = new CheckoutProcess("so-cart");

// Run on page load
checkout.calculateItemSummary();
checkout.calculateOrderTotal();

// Recalculate when user enters ZIP
const zipInput = document.querySelector("#zip");
if (zipInput) {
  zipInput.addEventListener("blur", () => checkout.calculateOrderTotal());
}

// Handle form submission with validation
const form = document.querySelector("#checkout-form");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // ✅ Check form validity
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const order = checkout.buildOrderData(formData);

    try {
      const result = await checkout.checkout(order);
      console.log("Order submitted successfully:", result);

      // ✅ Clear cart
      localStorage.removeItem("so-cart");

      // ✅ Redirect to success page
      window.location.href = "/checkout/success.html";
    } catch (err) {
      console.error("Error submitting order:", err);
      alertMessage(err.message || "There was an issue placing your order. Please try again."); // ✅ inline banner
    }
  });
}

// Expiration Date Handling
const expDatePicker = document.querySelector("#expDatePicker");
const expDate = document.querySelector("#expDate");
const openCalendar = document.querySelector("#openCalendar");

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

// helper: Luhn algorithm
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

// helper: expiration is in future (expVal is "MM/YY" or "YYYY-MM")
function expirationIsValid(expVal) {
  if (!expVal) return false;
  // support both formats
  if (expVal.includes("-")) {
    // YYYY-MM
    const [y, m] = expVal.split("-");
    const exp = new Date(Number(y), Number(m) - 1, 1);
    const now = new Date();
    // set to last day of month
    exp.setMonth(exp.getMonth() + 1);
    return exp > now;
  } else if (expVal.includes("/")) {
    // MM/YY
    const [mm, yy] = expVal.split("/");
    if (!mm || !yy) return false;
    const year = 2000 + Number(yy);
    const month = Number(mm) - 1;
    if (!Number.isInteger(month) || month < 0 || month > 11) return false;
    const exp = new Date(year, month + 1, 1); // first of next month
    return exp > new Date();
  }
  return false;
}
