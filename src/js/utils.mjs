// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

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

// load header and footer partials into #main-header and #main-footer
export async function loadHeaderFooter() {
  try {
    const header = await fetch("/partials/header.html").then(res => res.text());
    const footer = await fetch("/partials/footer.html").then(res => res.text());

    document.querySelector("#main-header").innerHTML = header;
    document.querySelector("#main-footer").innerHTML = footer;
  } catch (err) {
    console.error("Error loading header/footer:", err);
  }
}

// other existing exports (qs, getLocalStorage, etc.)

export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = true) {
  if (clear) parentElement.innerHTML = "";
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}
