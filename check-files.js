const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'assets');
const files = ['icon.png', 'adaptive-icon.png', 'splash.png'];
files.forEach(f => {
  const p = path.join(dir, f);
  const exists = fs.existsSync(p);
  const size = exists ? (fs.statSync(p).size / 1024).toFixed(1) + ' KB' : 'MISSING';
  console.log(`${f}: ${size}`);
});
