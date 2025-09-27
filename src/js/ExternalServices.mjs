const baseURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error(await res.text());
  }
}

export default class ExternalServices {
  constructor(category) {
    this.category = category;
    this.path = `${baseURL}products/search/${this.category}`;
  }

  // GET products by category
  async getData() {
    console.log("Fetching from:", this.path);
    const response = await fetch(this.path);
    const data = await convertToJson(response);
    console.log("API response:", data);
    return data.Result; // return only the array
  }

  // GET product by ID
  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    return convertToJson(response);
  }

  // POST checkout order
  async checkout(orderData) {
    try {
      console.log("Submitting order:", orderData);
      const response = await fetch(`${baseURL}checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
      const result = await convertToJson(response);
      console.log("Checkout response:", result);
      return result;
    } catch (err) {
      console.error("Checkout failed:", err);
      throw err;
    }
  }
}
