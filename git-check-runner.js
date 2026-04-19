const { execSync } = require('child_process');
const cwd = 'd:\\2026\\myidea\\memo\\memo';
const fs = require('fs');

const status = execSync('git status --short', { cwd }).toString();
const log = execSync('git log --oneline -5', { cwd }).toString();

fs.writeFileSync(cwd + '\\git-check.txt', 'STATUS:\n' + status + '\n\nLOG:\n' + log);
