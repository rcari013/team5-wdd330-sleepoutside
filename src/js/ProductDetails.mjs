// ProductDetails.mjs
export async function renderProductDetails(productId, container) {
  if (!productId) {
    container.innerHTML = "<p>No product selected.</p>";
    return;
  }

  try {
    const p = await fetch(`https://wdd330-backend.onrender.com/product/${productId}`)
      .then(r => r.json())
      .then(d => d.Result);

    if (!p) {
      container.innerHTML = `<p>Product not found: ${productId}</p>`;
      return;
    }

    container.innerHTML = renderProduct(p);

    const btn = container.querySelector("#addToCart");
    if (btn) {
      btn.addEventListener("click", () => {
        let cart = JSON.parse(localStorage.getItem("so-cart")) || [];

        const cartItem = {
          Id: p.Id,
          Name: p.Name,
          FinalPrice: p.FinalPrice ?? p.Price ?? 0,
          Image:
            p.Images?.PrimaryMedium ||
            p.Images?.PrimaryLarge ||
            p.Image ||
            p.ImageUrl ||
            (p.ImageName ? `/images/tents/${p.ImageName}` : ""),
          Color: p.Colors?.[0]?.ColorName || ""
        };

        cart.push(cartItem);
        localStorage.setItem("so-cart", JSON.stringify(cart));
        console.log("Added to cart:", cartItem);
      });
    }
  } catch (err) {
    container.innerHTML = `<p>Error loading product.</p>`;
    console.error(err);
  }
}

function money(v) {
  const n = Number(v ?? 0);
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function renderProduct(p) {
  const brand = p.Brand?.Name || p.Brand || p.Manufacturer || "";
  const name = p.Name || "";
  const desc = p.Description || p.DescriptionHtmlSimple || "";
  const price = p.FinalPrice ?? p.Price ?? 0;
  const image =
    p.Images?.PrimaryLarge ||
    p.Images?.PrimaryMedium ||
    p.Images?.PrimarySmall ||
    p.Image ||
    p.ImageUrl ||
    `/images/tents/${p.ImageName || ""}`;

  return `
    <section class="product-detail">
      ${brand ? `<h3>${brand}</h3>` : ""}
      <h2 class="divider">${name}</h2>
      <img class="divider" src="${image}" alt="${name}">
      <p class="product-card__price">${money(price)}</p>
      ${p.Color ? `<p class="product__color">${p.Color}</p>` : ""}
      ${desc ? `<p class="product__description">${desc}</p>` : ""}
      <div class="product-detail__add">
        <button id="addToCart" data-id="${p.Id}">Add to Cart</button>
      </div>
    </section>
  `;
}
