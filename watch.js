const chokidar = require('chokidar');
const fs = require('fs')
const exec = require('child_process')
// Initialize watcher.

const watcher = chokidar.watch('./src', {
    ignored: /((^|[\/\\])\..)|(\.js$)/, // ignore dotfiles
    persistent: true,
})
    .on('add', path => {
        console.log(`File ${path} has been added`)
        process(path)
    })
    .on('change', path => {
        console.log(`File ${path} has been changed`)
        process(path)
    })
    .on('unlink', path => {
        console.log(`File ${path} has been removed`)
        process(path)
    });

/**
 * @param {string} fp Filepath
 */
function process(fp) {
    if (fp.endsWith('.ts')) {
        const jsfp = fp.replace(/(.*)\.js$/, '$1.ts')
        exec('tsc')
        fs.readFile(jsfp, 'utf8', function (err, data) {
            if (err) throw err;
            const processedData = data.replace(/\/\/ @ignore-line[\s\S]*?(\r?\n).*(\r?\n|$)/g, '')
            fs.writeFile(fp, processedData)
        });
    }
}