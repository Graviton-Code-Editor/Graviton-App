const { task, desc } = require('jake')
const { spawn } = require('child_process')

// Easily run commands
const run  = (what, args, where = './') => {
    return new Promise((resolve, reject) => {
        let proc = spawn(what, args, { cwd: where, stdio: 'inherit', shell: true});
        proc.on('close', (code) => code == 0 ? resolve() : reject())
    })
}

desc('Run the server in develop mode');
task('dev_server', async function () {
    run('pnpm', ['run', '--filter', 'web', 'dev'])
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
    await run('cargo', ['nextest', 'run'])
});
task('web_tests', async function () {
    await run('pnpm', ['run', '--filter', 'web', 'test'])
});

desc('Format the code');
task('format_core', async function () {
    await run('cargo', ['fmt'])
});
task('format_web', async function () {
    await run('pnpm', ['run', '--filter', 'web', 'format'])
});

desc('Lint the code');
task('lint_core', async function () {
    await run('cargo', ['clippy'])
});

