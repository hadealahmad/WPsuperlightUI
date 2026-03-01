import fs from 'fs';
import path from 'path';

const devIndex = fs.readFileSync('dev-index.html', 'utf8');
const distCss = fs.readFileSync('dist.css', 'utf8');
const appMinJs = fs.readFileSync('app.min.js', 'utf8');

// 1. Inline CSS - replace the link tag
let built = devIndex.replace(
    /<link[^>]+href=["']dist\.css["'][^>]*>/i,
    `<style>${distCss}</style>`
);

// 2. Inline JS - replace the script tag
built = built.replace(
    /<script[^>]+src=["']app\.js["'][^>]*><\/script>/i,
    `<script type="module">${appMinJs}</script>`
);

// 3. Modest Minify (Collapse whitespaces except inside tags/strings)
// We remove double spaces and newlines to keep it "Superlight"
built = built
    .replace(/>\s+</g, '><') // remove whitespace between tags
    .replace(/\s{2,}/g, ' ') // collapse multiple spaces to single
    .trim();

fs.writeFileSync('index.html', built);

console.log('Build complete! Final index.html generated with 0 extra requests.');
const stats = fs.statSync('index.html');
console.log(`Final file size: ${(stats.size / 1024).toFixed(2)} KB`);
