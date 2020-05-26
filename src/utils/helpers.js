export default function dateConverter(date) {
   return new Date(date * 1000).toLocaleString();
}