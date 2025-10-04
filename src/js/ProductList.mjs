import { renderListWithTemplate } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";   // 🔄 renamed
import productCardTemplate from "./productCardTemplate.js";

export default class ProductList {
  constructor(category, listElement) {
    this.category = category;
    this.dataSource = new ExternalServices(category);   // 🔄 updated
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData();
    this.renderList(list);
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}

document.getElementById("search_form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const category = document.getElementById("search_input").value.trim();
  if (category) {
    const listElement = document.getElementById("product_list");
    const productList = new ProductList(category, listElement);
    productList.init();
  } else {
    alert("Please enter a category to search.");
  }
  document.getElementById("search_input").value = "";
});
