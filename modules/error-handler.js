const EventEmitter = require('events');

module.exports = new EventEmitter();

setTimeout(function(){
    module.exports.emit('ready');
}, 1000);
