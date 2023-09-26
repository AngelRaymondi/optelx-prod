const exec = require('./exec');

(async () => {
  await exec('npm run build', { windowsHide: true });
  await exec('npm start', { windowsHide: true });
})();