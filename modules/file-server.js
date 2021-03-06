const fs = require('fs');
const path = require('path');
const events = require('events');

function File () {
    // File Server Bundle
}

File.prototype = {
    get: function (filePath) {
        // Dest to 'dist' when production
        var src = './static/src/'

        var filePath = src + filePath;
        var extname = path.extname(filePath);
        var contentType = 'text/html';
        var file = new events.EventEmitter();

        switch (extname) {
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.jsx':
                contentType = 'text/babel';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            case '.json':
                contentType = 'application/json';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.jpg':
                contentType = 'image/jpg';
                break;
            case '.wav':
                contentType = 'audio/wav';
                break;
        }

        if (filePath == src+'/favicon.ico') return file;

        fs.readFile(filePath, function(error, content){
            if (error) {
                if (error.code == 'ENOENT') {
                    console.log("Access to %s is rejected", filePath);
                    return
                }
                else {
                    console.log("Request to %s is responded with %s", filePath, error.code);
                    console.log(typeof(error.code));
                    return
                }
            }
            else {
                file.emit('ready', content, contentType);
            }
        });

        return file;

    }

}

module.exports = new File();
