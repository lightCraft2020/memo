const { execSync } = require('child_process');
const cwd = 'd:\\2026\\myidea\\memo\\memo';

try {
  execSync('git add app.json eas.json package.json assets/ generate-assets.js', { cwd, stdio: 'inherit' });
  execSync('git commit -m "Add expo-font and fix EAS build config"', { cwd, stdio: 'inherit' });
  console.log('Commit successful!');
  console.log(execSync('git log --oneline -5', { cwd }).toString());
} catch (e) {
  console.error('Error:', e.message);
}
