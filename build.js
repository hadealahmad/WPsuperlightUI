import fs from 'fs';

let html = fs.readFileSync('dev-index.html', 'utf-8');
let css = fs.readFileSync('style.css', 'utf-8');
let js = fs.readFileSync('app.min.js', 'utf-8');

// Minify CSS (Simple Regex)
css = css
    .replace(/\/\*[\s\S]*?\*\//g, '') // remove comments
    .replace(/\s*([\{\}:;,])\s*/g, '$1') // remove spaces
    .replace(/\n+/g, '') // remove newlines
    .trim();

// Inline CSS
let built = html.replace(/<link[^>]+style\.css[^>]*>/i, `<style>${css}</style>`);

// Inline JS 
built = built.replace(/<script[^>]+app\.js[^>]*><\/script>/i, `<script type="module">${js}</script>`);

// Strip HTML Comments
built = built.replace(/<!--[\s\S]*?-->/g, '');

// Modest HTML Minify
built = built
    .replace(/>\s+</g, '><')
    .replace(/\s{2,}/g, ' ')
    .trim();

fs.writeFileSync('index.html', built);

console.log('Build complete! Superlight HTML finalized.');
const stats = fs.statSync('index.html');
console.log(`Final file size: ${(stats.size / 1024).toFixed(2)} KB`);
