// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// retrieve data from localStorage
export function getLocalStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;   // return null if nothing saved yet
  } catch {
    return null;                            // bad JSON? treat as empty
  }
}

// save data to localStorage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// render a list of templates
export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = true) {
  if (clear) parentElement.innerHTML = "";
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

// render a single template into a parent element
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

// fetch an HTML partial and return as string
export async function loadTemplate(path) {
  const response = await fetch(path);
  const text = await response.text();
  return text;
}

// combine header + footer loading
export async function loadHeaderFooter() {
  try {
    // load template files (note: no /public prefix)
    const header = await loadTemplate("/partials/header.html");
    const footer = await loadTemplate("/partials/footer.html");

    // grab placeholder DOM nodes
    const headerElement = document.querySelector("#main-header");
    const footerElement = document.querySelector("#main-footer");

    // render into DOM
    renderWithTemplate(header, headerElement);
    renderWithTemplate(footer, footerElement);
  } catch (err) {
    console.error("Error loading header/footer:", err);
  }
}
