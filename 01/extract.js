const fs = require('fs');
const html = fs.readFileSync('d:/kehu/meiguoyaopin/01/template_full/weight-loss.html', 'utf8');

const mainMatch = html.match(/<main id="brx-content"[^>]*>([\s\S]*?)<\/main>/);
if (mainMatch) {
  fs.writeFileSync('d:/kehu/meiguoyaopin/01/main_extracted.html', mainMatch[1]);
  console.log('Extracted main content');
} else {
  console.log('Main content not found');
}

const styleMatch = html.match(/<style id="bricks-frontend-inline-inline-css">([\s\S]*?)<\/style>/);
if (styleMatch) {
  fs.writeFileSync('d:/kehu/meiguoyaopin/01/inline_styles.css', styleMatch[1]);
  console.log('Extracted inline styles');
}
