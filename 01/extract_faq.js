const fs = require('fs');
const html = fs.readFileSync('d:/kehu/meiguoyaopin/01/template_full/faq.html', 'utf8');

const mainMatch = html.match(/<main id="brx-content"[^>]*>([\s\S]*?)<\/main>/);
if (mainMatch) {
  let mainContent = mainMatch[1];
  // Replace images path
  mainContent = mainContent.replace(/src="images\//g, 'src="/images/');
  mainContent = mainContent.replace(/srcset="images\//g, 'srcset="/images/');
  mainContent = mainContent.replace(/, images\//g, ', /images/');
  
  fs.writeFileSync('d:/kehu/meiguoyaopin/01/faq_extracted.html', mainContent);
  console.log('Extracted main content');
}

const styleMatch = html.match(/<style id="bricks-frontend-inline-inline-css">([\s\S]*?)<\/style>/);
if (styleMatch) {
  let css = styleMatch[1];
  // Replace images path
  css = css.replace(/url\([\"']?images\//g, 'url(/images/');
  fs.writeFileSync('d:/kehu/meiguoyaopin/01/faq_inline_styles.css', css);
  console.log('Extracted inline styles');
}

const fontsMatch = html.match(/<style id="bricks-frontend-inline-css">([\s\S]*?)<\/style>/);
if (fontsMatch) {
  let css = fontsMatch[1];
  css = css.replace(/url\(fonts\//g, 'url(/fonts/');
  fs.writeFileSync('d:/kehu/meiguoyaopin/01/faq_fonts.css', css);
  console.log('Extracted fonts styles');
}

// Extract bricksData
const scripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
if (scripts) {
  const bricksData = scripts.find(s => s.includes('bricksData'));
  if (bricksData) {
    fs.writeFileSync('d:/kehu/meiguoyaopin/01/faq_bricks_data.html', bricksData);
    console.log('Extracted bricksData');
  }
}
