const { execSync } = require('child_process');
try {
  execSync('git add .', {stdio: 'inherit'});
  execSync('git commit -m "fix: restore original design components"', {stdio: 'inherit'});
  execSync('git push', {stdio: 'inherit'});
  console.log('Push complete.');
} catch (e) {
  console.error(e);
}
