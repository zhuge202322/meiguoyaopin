const fs = require('fs');
const path = require('path');

const targetDirs = ['app', 'components', 'lib'];
const baseDir = 'd:/kehu/meiguoyaopin';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else {
      if (filePath.match(/\.(ts|tsx|js|jsx|html|json)$/)) {
        results.push(filePath);
      }
    }
  });
  return results;
}

let allFiles = [];
targetDirs.forEach(d => {
  const fullPath = path.join(baseDir, d);
  if (fs.existsSync(fullPath)) {
    allFiles = allFiles.concat(walk(fullPath));
  }
});

let changedCount = 0;
allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content
    .replace(/support@myfastrx\.com/gi, 'reliontomx@Gmail.com')
    .replace(/MyFastRx/g, 'NewFastRx');
    
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    changedCount++;
    console.log('Updated:', file.replace(baseDir, ''));
  }
});
console.log('Total files updated:', changedCount);
