const fs = require('fs');
const html = fs.readFileSync('d:/kehu/meiguoyaopin/01/template_full/weight-loss.html', 'utf8');
const links = html.match(/<link[^>]*rel="stylesheet"[^>]*>/g);
if (links) {
  console.log(links.join('\n'));
} else {
  console.log('No stylesheet links found');
}
