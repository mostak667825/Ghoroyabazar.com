const { execSync } = require('child_process');
try {
  console.log('--- GIT STATUS ---');
  console.log(execSync('git status').toString());
} catch (err) {
  console.error('Error running git:', err.message);
}
