const { task, desc } = require('jake')

desc('Build the Git extension');
task('build_git_extension', async function () {
    const { execa } = await import('execa');
    await execa('cargo', ['build'], {
        execPath: './extensions/git',
        stdio: 'inherit'
    });
});

desc('Run the desktop in develop mode');
task('dev_desktop', async function () {
    const { execa } = await import('execa');
    await execa('cargo', ['run'], {
        execPath: './desktop',
        stdio: 'inherit'
    });
});

desc('Build the desktop');
task('build_desktop', async function () {
    const { execa } = await import('execa');
    await execa('cargo', ['build'], {
        execPath: './desktop',
        stdio: 'inherit'
    });
});
