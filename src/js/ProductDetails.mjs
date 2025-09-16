const el = document.querySelector("#product-details");
const id = new URLSearchParams(location.search).get("product");

async function init() {
  if (!id) {
    el.innerHTML = "<p>No product selected.</p>";
    return;
  }

  try {
    const p = await fetch(`https://wdd330-backend.onrender.com/product/${id}`)
      .then(r => r.json())
      .then(d => d.Result);

    if (!p) {
      el.innerHTML = `<p>Product not found: ${id}</p>`;
    } else {
      el.innerHTML = renderProduct(p);

      const btn = el.querySelector("#addToCart");
      if (btn) {
        btn.addEventListener("click", () => {
          let cart = JSON.parse(localStorage.getItem("so-cart")) || [];

          // ✅ Save only the fields we need
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
    }
  } catch (err) {
    el.innerHTML = `<p>Error loading product.</p>`;
    console.error(err);
  }
}

init(); // <-- keep this to run on page load

function money(v) {
  const n = Number(v ?? 0);
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function renderProduct(p) {
  const brand = p.Brand?.Name || p.Brand || p.brand || p.Manufacturer || "";
  const name = p.Name || p.name || "";
  const desc = p.Description || p.description || p.DescriptionHtmlSimple || "";
  const price = p.FinalPrice ?? p.Price ?? p.price ?? 0;
  const image =
    p.Images?.PrimaryLarge ||
    p.Images?.PrimaryMedium ||
    p.Images?.PrimarySmall ||
    p.Image || p.image || p.ImageUrl || p.imageUrl ||
    `/images/tents/${p.ImageName || p.imageName || ""}`;

  return `
    <section class="product-detail">
      ${brand ? `<h3>${brand}</h3>` : ""}
      <h2 class="divider">${name}</h2>
      <img class="divider" src="${image}" alt="${name}">
      <p class="product-card__price">${money(price)}</p>
      ${p.Color || p.color ? `<p class="product__color">${p.Color || p.color}</p>` : ""}
      ${desc ? `<p class="product__description">${desc}</p>` : ""}
      <div class="product-detail__add">
        <button id="addToCart" data-id="${p.Id || p.id}">Add to Cart</button>
      </div>
    </section>
  `;
}

