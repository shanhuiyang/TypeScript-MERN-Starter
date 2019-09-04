const args = [ 'start' ];
const opts = { stdio: 'inherit', cwd: 'client/web', shell: true };
require('child_process').spawn('npm', args, opts);
