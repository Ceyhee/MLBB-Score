const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Extract CSS
const cssRegex = /<link rel="stylesheet" href="data:text\/css;base64,([^"]+)"\/>/g;
let cssMatches = 0;
html = html.replace(cssRegex, (match, base64) => {
    cssMatches++;
    const cssData = Buffer.from(base64, 'base64').toString('utf8');
    fs.writeFileSync('assets/style_' + cssMatches + '.css', cssData);
    return '<link rel="stylesheet" href="assets/style_' + cssMatches + '.css"/>';
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

// Extract Images > 10KB
const imgRegex = /src="data:image\/([^;]+);base64,([^"]+)"/g;
let imgMatches = 0;
html = html.replace(imgRegex, (match, ext, base64) => {
    if (base64.length < 10000) return match; // Keep small images inline
    imgMatches++;
    const extension = ext === 'jpeg' ? 'jpg' : ext === 'svg+xml' ? 'svg' : ext;
    const imgData = Buffer.from(base64, 'base64');
    const filename = 'assets/img_' + imgMatches + '.' + extension;
    fs.writeFileSync(filename, imgData);
    return 'src="' + filename + '"';
});

// Find 'w-50 lg:w-60 lg:mr-24 w-50 h-auto' maybe it's causing the layout to shift?
// Wait, the layout issue is that it's to the side.
// Wedding invitations are often centered.
// Wrap the <main> or the top-level div with a max-w-md mx-auto relative
html = html.replace(/<main data-theme-code="spark"[^>]*>/, (match) => {
    return match + '<div class="max-w-md mx-auto relative min-h-screen bg-white shadow-xl">';
});
html = html.replace('</body></html>', '</div></body></html>');

fs.writeFileSync('index.html', html);
console.log('Extracted ' + cssMatches + ' CSS files, ' + audioMatches + ' Audio files, ' + imgMatches + ' Images.');
