const fs = require('fs');
const html = fs.readFileSync('d:/kehu/meiguoyaopin/01/template_full/weight-loss.html', 'utf8');

const match = html.match(/<style id="bricks-frontend-inline-css">([\s\S]*?)<\/style>/);
if (match) {
  let css = match[1];
  css = css.replace(/url\(fonts\//g, 'url(/fonts/');
  fs.writeFileSync('d:/kehu/meiguoyaopin/public/css/weight-loss-fonts.css', css);
  console.log('Extracted weight-loss-fonts.css');
}
