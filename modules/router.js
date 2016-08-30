var Utils = require('./utils');
var File = require('./file-server');

function Router () {
    // Router Bundle
    console.log('Router online');
}

Router.prototype = {
    route: function(req, res, num) {
        console.log("%d %s|%s  %s", num, Utils.time(), req.method, req.url);
        // 1st Route
        switch (req.url.indexOf('.') > -1) {
            case true:
                this.serveFile(req, res);
                break;
            case false:
                this.servePage(req, res);
                break;
            default:
                console.log('First route failed');
                break;
        }
    },
    servePage: function(req, res) {
        switch (req.url) {
            case '/':
                this.homeHandler(req, res);
                break;
            case '/echo':
                this.echoHandler(req, res);
                break;
            case '/favicon.ico':
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                })
                res.end(null, 'utf-8');
                break;
            default:
                res.statusCode = 404;
                res.write('Page not Found');
                res.end();
                break;
        }
    },
    serveFile: function(req, res) {
        var file = File.get(req.url);
        file.once('ready', function(content, type){
            res.writeHead(200, {
                'Content-Type': type
            });
            res.end(content, 'utf-8');
            file = null;
        });
    }
};

Router.prototype.echoHandler = function (req, res) {
    var body = [];
    req.on('error', function(err){
        Utils.report('echo handler', err);
    }).on('data', function(chunk){
        body.push(chunk);
    }).on('end', function(){
        body = Buffer.concat(body).toString();
        res.writeHead(200, {
            'Content-Type': 'application/json',
        })
        res.write(body);
        res.end();
    });
};

Router.prototype.homeHandler = function (req, res) {
    var body = [];
    req.on('error', function(err){
        Utils.report('test handler', err);
    }).on('data', function(chunk){
        body.push(chunk);
    }).on('end', function(){
        body = Buffer.concat(body).toString();

        var file = File.get('test/test.html');
        file.once('ready', function(content, type){
            res.writeHead(200, {
                'Content-Type': type
            });
            res.end(content, 'utf-8');
            file = null;
        });
    });
};


module.exports = new Router();
