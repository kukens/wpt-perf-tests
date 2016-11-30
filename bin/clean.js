const del = require('del');

del(['./build/**'], { force: true }).then(paths => {
    console.log('Deleted files and folders:\n', paths.join('\n'));
});