const https = require('https');
https.get('https://checkout.myfastrx.com/onboard/', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log(data.substring(0, 1500));
    if(data.includes('id="root"') || data.includes('id="app"')) {
      console.log('\n--- Possible SPA detected ---');
    }
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
