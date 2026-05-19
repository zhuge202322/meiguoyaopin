const fs = require('fs');
const html = fs.readFileSync('d:/kehu/meiguoyaopin/01/main_extracted.html', 'utf8');

// safely escape the html to put in a JS template literal
let escaped = html.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');

fs.writeFileSync('d:/kehu/meiguoyaopin/app/weight-loss/content.ts', 'export const weightLossHtml = `' + escaped + '`;\n');
console.log('Saved to content.ts');
