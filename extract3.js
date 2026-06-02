const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Strip all script tags except my custom injected one at the end
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/g;
html = html.replace(scriptRegex, (match) => {
    if (match.includes('document.addEventListener')) {
        return match; // Keep my injected JS
    }
    return ''; // Remove all other scripts
});

// Extract CSS
const cssRegex = /href="data:text\/css;base64,([^"]+)"/g;
let cssMatches = 0;
html = html.replace(cssRegex, (match, base64) => {
    cssMatches++;
    const cssData = Buffer.from(base64, 'base64').toString('utf8');
    fs.writeFileSync('assets/style_' + cssMatches + '.css', cssData);
    return 'href="assets/style_' + cssMatches + '.css"';
});

// Extract Audio
const audioRegex = /<audio src="data:audio\/([^;]+);base64,([^"]+)"(.*?)>/g;
let audioMatches = 0;
html = html.replace(audioRegex, (match, ext, base64, rest) => {
    audioMatches++;
    const extension = ext === 'mpeg' ? 'mp3' : ext;
    const audioData = Buffer.from(base64, 'base64');
    fs.writeFileSync('assets/audio_' + audioMatches + '.' + extension, audioData);
    return '<audio src="assets/audio_' + audioMatches + '.' + extension + '"' + rest + '>';
});

// Extract Images
const imgRegex = /src="data:image\/([^;]+);base64,([^"]+)"/g;
let imgMatches = 0;
html = html.replace(imgRegex, (match, ext, base64) => {
    imgMatches++;
    const extension = ext === 'jpeg' ? 'jpg' : ext === 'svg+xml' ? 'svg' : ext;
    const imgData = Buffer.from(base64, 'base64');
    const filename = 'assets/img_' + imgMatches + '.' + extension;
    fs.writeFileSync(filename, imgData);
    return 'src="' + filename + '"';
});

// Extract SVG embedded inline in HTML if any (Wait, base64 SVGs are handled above)

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
console.log('Processed! CSS: ' + cssMatches + ' | Audio: ' + audioMatches + ' | Images: ' + imgMatches);
