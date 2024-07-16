const chokidar = require('chokidar');
const fs = require('fs')
const exec = require('child_process')
// Initialize watcher.

const watcher = chokidar.watch('./src', {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
})
    .on('change', path => {
        console.log(`File ${path} has been changed`)
        process(path)
    })
    // .on('unlink', path => {
    //     console.log(`File ${path} has been removed`)
    //     process(path)
    // });

/**
 * @param {string} fp Filepath
 */
function process(fp) {
    if (fp.endsWith('.ts')) {
        exec.exec('tsc')
    } else if (fp.endsWith('.js')) {

        let jsfp = fp.replace('src', 'dist')

        fs.readFile(fp, 'utf8', function (err, data) {
            if (err) throw err;
            let processedData = data.replace(/\/\/ @ignore-line[\s\S]*?(\r?\n).*(\r?\n|$)/g, '')

            fs.writeFile(jsfp, processedData, { flag: 'w' }, (err) => {
                if (err) throw err;
            });
        })
    }

}