const fs = require('fs');

exports.removeFileExtension = (file) => {
    return file.split('.').slice(0, -1).join('.').toString()
}

exports.readHTMLFile = (path, callback) => {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};
