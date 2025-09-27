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
