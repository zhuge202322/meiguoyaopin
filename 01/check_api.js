const fs = require('fs');
const code = fs.readFileSync('d:/kehu/meiguoyaopin/01/template_full/onboard/assets/index-CL-hqNYp.js', 'utf8');

// Match URLs starting with https://
const regex = /https:\/\/[^\"'\s`)]+/g;
let match;
const urls = new Set();
while ((match = regex.exec(code)) !== null) {
  urls.add(match[0]);
}

console.log('URLs found in JS:');
console.log(Array.from(urls));
