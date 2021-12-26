const { task, desc } = require('jake')
const { copyFile, mkdir } = require('fs-extra')
const rimraf = require('rimraf')
const { spawn } = require('child_process')

// Easily run commands
const run  = (what, args, where = './') => {
    return new Promise((resolve, reject) => {
        let proc = spawn(what, args, { cwd: where, stdio: 'inherit', shell: true});
        proc.on('close', (code) => code == 0 ? resolve() : reject())
    })
}


// Theses are all the build tasks by Graviton
const distPaths = ['desktop/src-tauri', 'server']
desc('Build the Git extension');
task('build_git_extension', async function () {
    await run('cargo', ['build'], './extensions/git')
    for(const path of distPaths ){
        rimraf.sync(`${path}/dist`)
        await mkdir(`${path}/dist`)
        await mkdir(`${path}/dist/extensions`)
        await mkdir(`${path}/dist/extensions/git`)
        try {
            await copyFile(`extensions/git/Cargo.toml`, `${path}/dist/extensions/git/Cargo.toml`)
            await copyFile(`target/debug/git_for_graviton.dll`, `${path}/dist/extensions/git/git.dll`)
            await copyFile(`target/debug/git_for_graviton.so`, `${path}/dist/extensions/git/git.so`)
        } catch { }
    }
    
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

