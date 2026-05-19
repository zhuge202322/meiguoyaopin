const https = require('https');
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://checkout.myfastrx.com';
const baseDir = 'd:/kehu/meiguoyaopin/01/template_full/onboard';

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
  try {
    // Download HTML
    const htmlPath = path.join(baseDir, 'index.html');
    await downloadFile(`${baseUrl}/onboard/`, htmlPath);
    
    // Read HTML to find assets
    let html = fs.readFileSync(htmlPath, 'utf8');
    
    // Extract asset paths
    const assetRegex = /(?:href|src)="(\/onboard\/assets\/[^"]+)"/g;
    let match;
    const assets = [];
    while ((match = assetRegex.exec(html)) !== null) {
      assets.push(match[1]);
    }
    
    // Download assets
    for (const assetPath of assets) {
      const fileName = path.basename(assetPath);
      const dest = path.join(baseDir, 'assets', fileName);
      await downloadFile(`${baseUrl}${assetPath}`, dest);
      
      // Update HTML to use relative paths
      html = html.replace(new RegExp(`"${assetPath}"`, 'g'), `"assets/${fileName}"`);
    }
    
    // Save updated HTML
    fs.writeFileSync(htmlPath, html);
    console.log('HTML updated with local relative paths.');
    
  } catch (err) {
    console.error(err);
  }
}

main();
