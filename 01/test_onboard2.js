const https = require('https');
const fs = require('fs');
https.get('https://checkout.myfastrx.com/onboard/', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    fs.writeFileSync('onboard.html', data);
    console.log('Saved to onboard.html');
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
