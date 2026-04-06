const pdfParse = require('./node_modules/pdf-parse/index.js');
const fs = require('fs');
const buf = fs.readFileSync('attached_assets/LATIHAN_TKA_PAKET_2_1774367629452.pdf');
console.log('Type:', typeof pdfParse);
if (typeof pdfParse === 'function') {
  pdfParse(buf).then(data => {
    console.log('PAGES:', data.numpages);
    console.log(data.text.substring(0, 15000));
    fs.unlinkSync('parse_pdf_temp.cjs');
  }).catch(e => console.error(e.message));
} else if (pdfParse && pdfParse.default) {
  pdfParse.default(buf).then(data => {
    console.log('PAGES:', data.numpages);
    console.log(data.text.substring(0, 15000));
    fs.unlinkSync('parse_pdf_temp.cjs');
  }).catch(e => console.error(e.message));
} else {
  console.log('Keys:', Object.keys(pdfParse));
}
