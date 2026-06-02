const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Extract CSS
const cssRegex = /<link rel="stylesheet" href="data:text\/css;base64,([^"]+)"\s*\/?>/g;
let cssMatches = 0;
html = html.replace(cssRegex, (match, base64) => {
    cssMatches++;
    const cssData = Buffer.from(base64, 'base64').toString('utf8');
    fs.writeFileSync('assets/style_' + cssMatches + '.css', cssData);
    return '<link rel="stylesheet" href="assets/style_' + cssMatches + '.css"/>';
});

fs.writeFileSync('index.html', html);
console.log('Extracted ' + cssMatches + ' CSS files.');
