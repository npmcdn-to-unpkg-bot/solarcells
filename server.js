// Default Modules
const http = require('http');

// Custom Modules
var Router = require('./modules/router');

// Global Variables
var g_cnt = 0;

var server = http.createServer(function(request, response){
    // Increment Req No.
    g_cnt+=1;

    Router.route(request, response, g_cnt);
}).listen(process.env.PORT || 1209);
