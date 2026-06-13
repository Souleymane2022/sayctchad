const { execSync } = require('child_process');
try {
  execSync('git add client/src/pages/About.tsx', {stdio: 'inherit'});
  execSync('git commit -m "feat: add official documents section to about page"', {stdio: 'inherit'});
  execSync('git push', {stdio: 'inherit'});
  console.log('Push complete.');
} catch (e) {
  console.error(e);
}
