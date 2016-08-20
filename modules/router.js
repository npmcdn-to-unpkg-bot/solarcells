// // Parse Request and Dispatch
// module.exports = function (req) {
//     // Parse it
//     var url = req.url;
//     switch (url) {
//         case '/echo':
//             return echoHandler();
//         case '/test':
//             console.log('testing');
//             return;
//         case '/':
//             console.log('home');
//             return;
//         default:
//             console.error('Not Found');
//             return;
//     }
// };


function Router (server) {
    this.server = server;
}

Router.prototype = {
    get: function(url, func) {
        this.server.on(url, function(data) {
            func();
            response.write('JSON.stringify(responseBody)');
            response.end();
        });
    },
    route: function(req, res) {
        var headers = req.headers;
        // unveilObj(headers);
        var method = req.method;
        var url = req.url;
        var body = [];
        req.on('error', function(err){
            console.error(err);
        }).on('data', function(chunk) {
            body.push(chunk);
        }).on('end', function(){
            body = Buffer.concat(body).toString();

            // Set response
            res.on('error', function(err) {
                console.error(err);
            });

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            // response.writeHead(200, {
            //     'Content-Type': 'application/json'
            // });

            var responseBody = {
                headers: headers,
                method: method,
                url: url,
                body: body
            };

            res.write(JSON.stringify(responseBody));
            res.end();
        });
    }
};

module.exports = Router;


function echoHandler () {
    console.log('Handling echo');
}
