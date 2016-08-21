// Default Modules
const http = require('http');

// Custom Modules
var Router = require('./modules/router');

// Global Variables
var g_cnt = 0;

var server = http.createServer(function(request, response){
    // Print Req No.
    g_cnt+=1;
    console.log('Request No: %s', g_cnt);

    Router.route(request, response);
}).listen(8000);

// // Init Router
// var router = new Router();
