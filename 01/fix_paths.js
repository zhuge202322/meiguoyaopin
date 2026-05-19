const fs = require('fs');
let html = fs.readFileSync('d:/kehu/meiguoyaopin/01/main_extracted.html', 'utf8');
html = html.replace(/src="images\//g, 'src="/images/');
html = html.replace(/srcset="images\//g, 'srcset="/images/');
html = html.replace(/, images\//g, ', /images/');
html = html.replace(/href="\.\/onboard\/index\.html\/"/g, 'href="/onboard"');
fs.writeFileSync('d:/kehu/meiguoyaopin/01/main_extracted.html', html);
console.log('Fixed image paths');
