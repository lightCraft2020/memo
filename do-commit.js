const { execSync } = require('child_process');
const cwd = 'd:\\2026\\myidea\\memo\\memo';

try {
  execSync('git add -A', { cwd, stdio: 'inherit' });
  execSync('git commit -m "Add All category chip, improve app icon, fix dark mode"', { cwd, stdio: 'inherit' });
  console.log('Commit successful!');
  console.log(execSync('git log --oneline -3', { cwd }).toString());
} catch (e) {
  console.error('Error:', e.message);
}
