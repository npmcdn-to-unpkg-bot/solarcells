var Utils = require('./utils');
var File = require('./file-server');

function Router () {
    // Router Bundle
    console.log('Router online');
}

Router.prototype = {
    route: function(req, res) {
        console.log('Requested: %s', req.url);
        // Route
        switch (req.url) {
            case '/':
                this.homepageHandler(req, res);
                break
            case '/echo':
                this.echoHandler(req, res);
                break
            case '/favicon.ico':
                res.statusCode = 404;
                res.end();
                break
            case '/test':
                var file = File.get('/static/test.html');
                file.once('ready', function(content, type){
                    console.log(this);
                    res.writeHead(200, {
                        'Content-Type': type
                    });
                    res.end(content, 'utf-8');
                    file = null;
                    delete this;
                    console.log(this);
                    return
                })
                break
            default:
                res.statusCode = 404;
                res.write('Page not Found');
                res.end();
                break
        }
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

Router.prototype.homepageHandler = function (req, res) {
    var body = [];
    req.on('error', function(err){
        Utils.report('homepage handler', err);
    }).on('data', function(chunk){
        body.push(chunk);
    }).on('end', function(){
        // Response
        body = Buffer.concat(body).toString();
        res.writeHead(200, {
            'Content-Type': 'text/html',
        })
        res.write('<h1>Hello</h1>', 'utf-8');
        res.end();
    });
};


module.exports = new Router();


//
//
// req.on('error', function(err){
//     console.error(err);
// }).on('data', function(chunk) {
//     body.push(chunk);
// }).on('end', function(){
//     body = Buffer.concat(body).toString();
//
//     // Set response
//     res.on('error', function(err) {
//         console.error(err);
//     });
//
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'application/json');
//     // response.writeHead(200, {
//     //     'Content-Type': 'application/json'
//     // });
//
//     var responseBody = {
//         headers: headers,
//         method: method,
//         url: url,
//         body: body
//     };
//
//     res.write(JSON.stringify(responseBody));
//     res.end();
// });
