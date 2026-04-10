// This script generates PNG icons from the SVG.
// Run with: node generate-icons.js (requires sharp or canvas, or use an online converter)
// For deployment, you can convert icon.svg to icon-192.png and icon-512.png manually,
// or use a service like cloudconvert.com

// The app works with SVG icons referenced in the manifest.
// For full PWA compliance, convert to PNG using:
//   npx sharp-cli --input icon.svg --output icon-192.png --resize 192 192
//   npx sharp-cli --input icon.svg --output icon-512.png --resize 512 512

console.log('See comments above for icon generation instructions.')
console.log('SVG icon is at: /public/icons/icon.svg')
