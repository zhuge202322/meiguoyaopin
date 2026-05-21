const fs = require('fs');
const html = fs.readFileSync('d:/kehu/meiguoyaopin/01/faq_extracted.html', 'utf8');

const startIdx = html.indexOf('<div id="brxe-jitfwy"');
const endIdx = html.indexOf('<div id="brxe-gzngkh"');

// Count opening and closing divs between startIdx and endIdx
const substring = html.substring(startIdx, endIdx);
const openCount = (substring.match(/<div\b/g) || []).length;
const closeCount = (substring.match(/<\/div>/g) || []).length;

console.log("Open divs:", openCount, "Close divs:", closeCount);
