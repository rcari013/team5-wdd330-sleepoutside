import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  // ✅ calculate and show total
  showCartTotal(cartItems);
}

function cartItemTemplate(item) {
  const image =
    item.Images?.PrimaryMedium ||
    item.Images?.PrimaryLarge ||
    item.Image ||
    item.image ||
    item.ImageUrl ||
    "/images/placeholder.png"; // fallback

  return `<li class="cart-card divider">
    <a href="/product_pages/index.html?product=${item.Id}" class="cart-card__image">
      <img src="${image}" alt="${item.Name}" />
    </a>
    <a href="/product_pages/index.html?product=${item.Id}">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    ${item.Colors?.[0]?.ColorName ? `<p class="cart-card__color">${item.Colors[0].ColorName}</p>` : ""}
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;
}

function showCartTotal(cartItems) {
  const footer = document.querySelector(".cart-footer");
  const totalElement = document.querySelector(".cart-total");
  const discountElement = document.querySelector(".cart-discount");

  // Example discount logic (10% off if more than 3 items)
  let discount = 0;
  if (cartItems.length > 3) {
    const totalBeforeDiscount = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);
    discount = totalBeforeDiscount * 0.1; // 10% discount
    discountElement.textContent = `Discount: -$${discount.toFixed(2)}`;
    discountElement.classList.remove("hide");
  } else {
    discountElement.classList.add("hide");
  }

  if (cartItems.length > 0) {
    footer.classList.remove("hide");
    const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);
    totalElement.textContent = `Total: $${total.toFixed(2)}`;
  } else {
    footer.classList.add("hide");
  }
}

renderCartContents();
