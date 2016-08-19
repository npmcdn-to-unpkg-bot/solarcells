var http = require('http');
var errorHandler = require('./modules/error-handler');

errorHandler.on('ready', function(){
   console.log('module online');
});

http.createServer(function(request, response) {
  var headers = request.headers;
  var method = request.method;
  var url = request.url;
  var body = [];
  console.log('\n'+'new');
  unveilObj(request);
  request.on('error', function(err) {
    console.error(err);
  }).on('data', function(chunk) {
    body.push(chunk);
    console.log('Raw Data: '+body);
  }).on('end', function() {
    body = Buffer.concat(body).toString();
    console.log('Concatted: '+body);
    // At this point, we have the headers, method, url and body, and can now
    // do whatever we need to in order to respond to this request.
  });
}).listen(8000); // Activates this server, listening on port 8080.


function unveilObj (obj) {
    var arr = Object.keys(obj);
    var list = ['headers','method','url'];
    for (x in arr) {
        key = arr[x];
        if (list.indexOf(key) > -1) {
            console.log(
                key
            );
            console.log(
                obj[key]
            );
        }
    }
}
