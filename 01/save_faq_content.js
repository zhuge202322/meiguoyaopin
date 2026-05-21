const fs = require('fs');
const html = fs.readFileSync('d:/kehu/meiguoyaopin/01/faq_extracted.html', 'utf8');

let escaped = html.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
fs.writeFileSync('d:/kehu/meiguoyaopin/app/faq/content.ts', 'export const faqHtml = `' + escaped + '`;\n');
console.log('Saved to content.ts');
