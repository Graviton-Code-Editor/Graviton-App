const { task, desc } = require('jake')
const { spawn } = require('child_process')

// Easily run commands
const run  = (what, args, where = './') => {
    return new Promise((resolve, reject) => {
        let proc = spawn(what, args, { cwd: where, stdio: 'inherit', shell: true});
        proc.on('close', (code) => code == 0 ? resolve() : reject())
    })
}


desc('Watch web_components for changes');
task('dev_web_components', async function () {
    run('yarn', ['--cwd', 'web_components', 'run', 'dev'])
});


desc('Build web_components');
task('build_web_components', async function () {
    await run('yarn', ['--cwd', 'web_components', 'run', 'build'])
});

desc('Run the server in develop mode');
task('dev_server', async function () {
    run('yarn', ['--cwd', 'web', 'run', 'dev'])
    await run('cargo run', [], './server')
});

desc('Run the desktop in develop mode');
task('dev_desktop', async function () {
    await run('cargo tauri dev', [], './desktop')
});

desc('Build the desktop');
task('build_desktop', async function () {
    await run('cargo tauri build', [], './desktop')
});

desc('Run tests');
task('core_tests', async function () {
    await run('cargo', ['test'])
});
task('web_tests', async function () {
    await run('yarn', ['--cwd', './web','run','test'])
});

desc('Format the code');
task('format_core', async function () {
    await run('cargo', ['fmt'])
});
task('format_web', async function () {
    await run('yarn', ['--cwd', './web','run','format'])
});

desc('Lint the code');
task('lint_core', async function () {
    await run('cargo', ['clippy'])
});

