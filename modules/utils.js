function Utils () {
    // Utils Bundle
    console.log('Utils loaded');
}

Utils.prototype.report = function (name, err) {
    if (typeof(err) === 'object') {
        console.log('%s error:', name, err);
    } else {
        console.log('%s error: %s', name, err);
    }
};

Utils.prototype.inspect = function (obj) {
    var arr = Object.keys(obj);
    for (x in arr) {
        key = arr[x];
        if (true) {
            console.log(
                "%s: %s",key,JSON.stringify(obj[key])
            );
        }
    }
};

module.exports = new Utils();
