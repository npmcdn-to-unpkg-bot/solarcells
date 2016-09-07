var MicroEvent = function () {};
MicroEvent.prototype = {
    bind: function(event, fct) {
        // Init at start or when all listeners removed
        this._events = this._events || {};
        this._events[event] = this._events[event] || [];
        this._events[event].push(fct);
    },
    update: function (event, fct) {
        this._events = this._events || {};
        if (event in this._events) {
            this._events[event].length = 0;
        } else {
            this._events[event] = [];
        }
        this._events[event].push(fct);
    },
    unbind: function(event, fct) {
        this._events = this._events || {};
        if (event in this._events === false) return;
        this._events[event].splice(this._events[event].indexOf(fct), 1);
    },
    trigger: function(event) {
        this._events = this._events || {};
        if (event in this._events === false) return;
        for (var i = 0; i < this._events[event].length; i++) {
            this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
        }
    },
    once: function(event) {
        this.events = this._events || {};
        if (event in this._events === false) return;
        if (typeof this._events[event][0] === 'undefined') return;
        for (var i = 0; i < this._events[event].length; i++) {
            this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
            this.unbind(event, this._events[event][i]);
        } // Fire and unbind all fcts unber the event
    }
};

MicroEvent.prototype.drag_cnt = 0;

var clone = function (obj) {
    return JSON.parse(JSON.stringify(obj));
};

var extend = function (prev, next) {
    return clone($.extend(prev, next));
};
