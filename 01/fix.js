const fs = require('fs');
const path = require('path');
const dir = 'd:/kehu/meiguoyaopin/01/template_full';

const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
let count = 0;

files.forEach(f => {
  const p = path.join(dir, f);
  let content = fs.readFileSync(p, 'utf8');
  let originalContent = content;
  
  // Replace attributes with absolute path to wp-content
  content = content.replace(/(href|src|content)=["']\/wp-content\/([^"']+)["']/g, '$1="https://www.myfastrx.com/wp-content/$2"');
  
  // Replace strings in scripts like '"/wp-content/..."'
  content = content.replace(/"\/wp-content\/([^"]+)"/g, '"https://www.myfastrx.com/wp-content/$1"');
  
  if (content !== originalContent) {
    fs.writeFileSync(p, content);
    console.log(`Updated ${f}`);
    count++;
  }
});

console.log(`Finished updating ${count} files.`);
