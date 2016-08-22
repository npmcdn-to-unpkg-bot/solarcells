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


Utils.prototype.time = function () {
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    // var year = date.getFullYear();
    //
    // var month = date.getMonth() + 1;
    // month = (month < 10 ? "0" : "") + month;
    //
    // var day  = date.getDate();
    // day = (day < 10 ? "0" : "") + day;

    return hour + ":" + min + ":" + sec;

};


module.exports = new Utils();
