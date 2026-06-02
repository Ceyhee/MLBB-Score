const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Extract CSS
const cssRegex = /href="data:text\/css;base64,([^"]+)"/g;
let cssMatches = 0;
html = html.replace(cssRegex, (match, base64) => {
    cssMatches++;
    const cssData = Buffer.from(base64, 'base64').toString('utf8');
    fs.writeFileSync('assets/style_' + cssMatches + '.css', cssData);
    return 'href="assets/style_' + cssMatches + '.css"';
});

// Extract Images > 10KB
const imgRegex = /src="data:image\/([^;]+);base64,([^"]+)"/g;
let imgMatches = 0;
html = html.replace(imgRegex, (match, ext, base64) => {
    if (base64.length < 10000) return match; 
    imgMatches++;
    const extension = ext === 'jpeg' ? 'jpg' : ext === 'svg+xml' ? 'svg' : ext;
    const imgData = Buffer.from(base64, 'base64');
    const filename = 'assets/img_' + imgMatches + '.' + extension;
    fs.writeFileSync(filename, imgData);
    return 'src="' + filename + '"';
});

// Extract Background Images
const bgImgRegex = /url\("data:image\/([^;]+);base64,([^"]+)"\)/g;
let bgImgMatches = 0;
html = html.replace(bgImgRegex, (match, ext, base64) => {
    if (base64.length < 10000) return match; 
    bgImgMatches++;
    const extension = ext === 'jpeg' ? 'jpg' : ext === 'svg+xml' ? 'svg' : ext;
    const imgData = Buffer.from(base64, 'base64');
    const filename = 'assets/bg_' + bgImgMatches + '.' + extension;
    fs.writeFileSync(filename, imgData);
    return 'url("' + filename + '")';
});

// Layout Fix
// Add CSS to emulate mobile screen on desktop
const layoutFix = `<style>
  @media (min-width: 481px) {
    body {
      max-width: 480px !important;
      margin: 0 auto !important;
      box-shadow: 0 0 20px rgba(0,0,0,0.2) !important;
      position: relative !important;
      min-height: 100vh !important;
    }
    html {
      background-color: #f3f4f6 !important;
    }
    .fixed {
      position: absolute !important;
    }
  }
</style></head>`;

html = html.replace('</head>', layoutFix);

fs.writeFileSync('index.html', html);
console.log('Extracted ' + cssMatches + ' CSS, ' + imgMatches + ' Images, ' + bgImgMatches + ' BG Images.');
