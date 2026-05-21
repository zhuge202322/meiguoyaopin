const fs = require('fs');

const items = [
  { q: "What is MyFastRx?", a: "MyFastRx is a telehealth platform connecting you to U.S.-licensed physicians for online consultations and prescription medication delivered to your home." },
  { q: "How does the process work?", a: "Pick your treatment, answer a brief set of medical questions, and a doctor will review within ~24 hours. Approved prescriptions ship free and discreetly." },
  { q: "How much does it cost?", a: "Pricing is flat and transparent. Semaglutide is $169/mo and Tirzepatide is $249/mo — consultation, medication, and shipping included." },
  { q: "Do you accept insurance?", a: "MyFastRx does not require insurance. Our prices are designed to be more affordable than most pharmacies even without coverage." },
  { q: "Is my information secure?", a: "Yes. All consultations and records are protected under HIPAA standards." },
];

let itemsHtml = '';
items.forEach((item, i) => {
  itemsHtml += `
<div id="faq-item-${i}" class="brxe-block faq-accordion__item">
  <div id="faq-title-wrap-${i}" class="brxe-block faq-accordion__item--title accordion-title-wrapper" role="button" aria-expanded="false" tabindex="0" aria-controls="faq-content-${i}">
    <h3 id="faq-title-${i}" class="brxe-heading faq-accordion__item--title__heading">${item.q}</h3>
    <svg class="brxe-icon faq-accordion__item__title-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="33" viewBox="0 0 32 33" fill="none"><path d="M17.1112 21.993L22.6667 16.1597M22.6667 16.1597L17.1112 10.3264M22.6667 16.1597L9.33337 16.1597" stroke="#1F2523" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
  </div>
  <div id="faq-content-${i}" class="brxe-block faq-accordion__item--content accordion-content-wrapper" role="region" aria-labelledby="faq-title-${i}">
    <div class="brxe-text faq-accordion__item--title__content--text">
      <p>${item.a}</p>
    </div>
  </div>
</div>`;
});

let html = fs.readFileSync('d:/kehu/meiguoyaopin/01/faq_extracted.html', 'utf8');

const startStr = '<div id="brxe-jitfwy" data-script-id="jitfwy" class="brxe-accordion-nested faq-accordion">';
const startIndex = html.indexOf(startStr);
const endStr = '<div id="brxe-gzngkh"';
const endIndex = html.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  const before = html.substring(0, startIndex + startStr.length);
  // Need to append `</div>` to close `brxe-jitfwy` because we replace up to endIdx, which strips it out!
  const after = '</div>' + html.substring(endIndex);
  const newHtml = before + itemsHtml + after;
  
  fs.writeFileSync('d:/kehu/meiguoyaopin/01/faq_extracted_custom.html', newHtml);
  
  let escaped = newHtml.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
  fs.writeFileSync('d:/kehu/meiguoyaopin/app/faq/content.ts', 'export const faqHtml = `' + escaped + '`;\n');
  
  console.log('Successfully replaced FAQ items and generated content.ts');
} else {
  console.log('Failed to find bounds', startIndex, endIndex);
}
