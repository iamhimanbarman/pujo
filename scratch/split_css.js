const fs = require('fs');
const path = require('path');

const srcGlobals = path.join(process.cwd(), 'src/app/globals.css');
const stylesDir = path.join(process.cwd(), 'src/styles');

if (!fs.existsSync(stylesDir)) {
  fs.mkdirSync(stylesDir, { recursive: true });
}

const content = fs.readFileSync(srcGlobals, 'utf8');

// I'll extract parts using regex or simple string manipulation.
// But wait, the user's borders.css needs to be written. Let's just write the borders.css first.
// Actually, writing a precise splitter is hard because of the nested blocks.
// Let's just create the files manually since I have the exact content.

console.log("I will write the files manually via write_to_file for safety and precision.");
