const fs = require('fs');
const https = require('https');
const path = require('path');

const code = fs.readFileSync('d:/kehu/meiguoyaopin/01/template_full/onboard/assets/index-CL-hqNYp.js', 'utf8');
const regex = /\/onboard\/assets\/[^\"'\s`)]+/g;
let match;
const urls = new Set();
while ((match = regex.exec(code)) !== null) {
  urls.add(match[0]);
}

const urlList = Array.from(urls);
console.log('Found assets:', urlList);

const baseUrl = 'https://checkout.myfastrx.com';
const baseDir = 'd:/kehu/meiguoyaopin/01/template_full';

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${url} to ${dest}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  for (const assetPath of urlList) {
    const dest = path.join(baseDir, assetPath);
    await downloadFile(`${baseUrl}${assetPath}`, dest);
  }
}

main();
