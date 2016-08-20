var http = require('http');
var errorHandler = require('./modules/error-handler');
var Router = require('./modules/router');

var cnt = 0;

errorHandler.on('ready', function(){
   console.log('module online');
});

var server = http.createServer(function(request, response){
    cnt+=1;
    console.log('Request No: %s', cnt);
    var headers = request.headers;
    // unveilObj(headers);
    var method = request.method;
    var url = request.url;
    var body = [];

    router.route(request, response);

    console.log(this.eventNames());
}).listen(8000);


var router = new Router(server);

router.get('/', function(){
    console.log('loading homepage');
});



function unveilObj (obj) {
    var arr = Object.keys(obj);
    // var list = ['headers','method','url'];
    for (x in arr) {
        key = arr[x];
        if (true) {
        // if (list.indexOf(key) > -1) {
            console.log(
                "%s: %s",key,JSON.stringify(obj[key])
            );
            // console.log(
            //     obj[key]
            // );
        }
    }
}
