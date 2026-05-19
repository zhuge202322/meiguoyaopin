const scrape = require('website-scraper');

const options = {
  urls: ['https://www.myfastrx.com/'],
  directory: './template_full',
  recursive: true,
  maxRecursiveDepth: 3, 
  sources: [
    { selector: 'img', attr: 'src' },
    { selector: 'img', attr: 'srcset' },
    { selector: 'link[rel="stylesheet"]', attr: 'href' },
    { selector: 'script', attr: 'src' },
    { selector: 'source', attr: 'srcset' },
    { selector: 'style' }
  ],
  request: {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  },
  urlFilter: function(url) {
    if (!url.startsWith('https://www.myfastrx.com')) return false;
    if (url.includes('wp-json') || url.includes('wp-admin') || url.includes('xmlrpc') || url.includes('feed')) return false;
    
    // If it's a static resource, always allow it
    if (url.includes('.css') || url.includes('.js') || url.includes('.png') || url.includes('.jpg') || url.includes('.woff') || url.includes('.ttf') || url.includes('.svg')) {
      return true;
    }
    
    // If it's a page and has query params (like search or tracking), skip it to avoid infinite loops
    if (url.includes('?') && !url.includes('.css') && !url.includes('.js')) return false;
    
    return true;
  }
};

const run = async () => {
  try {
    console.log('Starting full site scrape...');
    const defaultScrape = scrape.default || scrape;
    await defaultScrape(options);
    console.log('Successfully downloaded all pages to ./template_full');
  } catch (err) {
    console.error('An error occurred', err);
  }
};

run();
