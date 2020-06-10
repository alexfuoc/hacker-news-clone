export function dateConverter(date) {
   return new Date(date * 1000).toLocaleString();
}

export function createMarkup(innerText) {
  return { __html: innerText };
}