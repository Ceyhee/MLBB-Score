const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Strip responsive classes that cause the layout shift on large screens
html = html.replace(/\blg:[^\s"]+/g, '');
html = html.replace(/\bxl:[^\s"]+/g, '');
html = html.replace(/\bmax-lg:[^\s"]+/g, '');
html = html.replace(/\bmd:[^\s"]+/g, '');
html = html.replace(/\bmax-md:[^\s"]+/g, '');
html = html.replace(/\bsm:[^\s"]+/g, '');
html = html.replace(/\bmax-sm:[^\s"]+/g, '');

// Clean up extra spaces in class attributes
html = html.replace(/class="\s+/g, 'class="');
html = html.replace(/\s+"/g, '"');
html = html.replace(/\s{2,}/g, ' ');

fs.writeFileSync('index.html', html);
console.log('Stripped responsive classes!');
