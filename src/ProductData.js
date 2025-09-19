const baseURL = import.meta.env.VITE_SERVER_URL;

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
  constructor(category) {
    this.category = category;
    this.path = `${baseURL}products/search/${this.category}`;
  }

async getData() {
  console.log("Fetching from:", this.path);
  const response = await fetch(this.path);
  const data = await convertToJson(response);
  console.log("API response:", data);
  return data.Result; // 👈 return only the array
}



async findProductById(id) {
  const response = await fetch(`${baseURL}product/${id}`);
  const data = await convertToJson(response);
  return data.Result; // unwrap the actual product
}



}
