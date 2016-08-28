var MicroEvent = function () {};
MicroEvent.prototype = {
    _events: function () {
        console.log(this._events);
    },
    bind: function(event, fct) {
        // Init at start or when all listeners removed
        this._events = this._events || {};                  // Wrap all events
        this._events[event] = this._events[event] || [];    // Add this event
        this._events[event].push(fct);                      // Bind function to this event
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
    }
};

var Config = {
    defaultStyle: {
        'button': {
            marginTop: "10%",
            padding: "80px 24px",
            outline: "0 !important",
            borderRadius: "50%",
            border: "0",
            boxShadow: "none",
            fontSize: "30px",
            background: "#7fb981",
            color: "white",
            opacity: 0.6,
            fontFamily: "'Raleway', sans-serif"
        },
    },
};

Config['customStyle'] = Config['defaultStyle'];

var EventCenter = new MicroEvent();

$(document).ready(function(){
    $('#preload-content').css({
        opacity:1
    });
});

var ModuleNav = React.createClass({
    render: function () {
        var self = this;
        var modules = self.props.modules.map(function(name, i){
            var load = function () {
                self.props.load(name);
                self.props.eventManager.trigger('test', name, self.props);
            }
            return <button onClick={load} key={i}>{name}</button>;
        });
        return (
            <row>
                {modules}
            </row>
        );
    }
});

var LiveInput = React.createClass({
    getInitialState: function () {
        return {
            text: this.props.params
        }
    },
    onChange: function(e) {
        var attr = this.props.name;
        var value = e.target.value;
        this.setState({
            text: value
        });
        if (!Number(value)) {
            Config['customStyle'][this.props.mode][attr] = value;
            EventCenter.trigger('updateView');
        }
    },
    render: function () {
        return (
            <box>
                <span>{this.props.name}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <input onChange={this.onChange} value={this.state.text}/>
            </box>
        );
    }
});

var ButtonSpecs = React.createClass({
    render: function () {
        var style = Config['defaultStyle']['button'];
        var attr = Object.keys(style);
        var inputGroup = [];
        for (var i = 0; i < attr.length; i++) {
            var key = attr[i];
            inputGroup.push(
                <LiveInput mode={'button'} name={key} params={style[key]} key={i}
                    eventManager={this.props.eventManager}/>
            );
        }


        return (
            <row>
                {inputGroup}
            </row>
        );
    }
});

var ModuleManager = React.createClass({
    render: function () {
        var module;
        switch (this.props.mode) {
            case 'button':
                module = <ButtonSpecs eventManager={this.props.eventManager} />
                break;
            default:
                module = <box>{'default'}</box>
                break;
        }
        return (module);
    }
});

var GeneratorSpecs = React.createClass({
    render: function () {
        var style = {
            height: '400px'
        };
        console.log(1);
        return (
            <card>
                <ModuleNav modules={this.props.modules} mode={this.props.mode}
                    load={this.props.load} eventManager={this.props.eventManager}/>
                <ModuleManager mode={this.props.mode} eventManager={this.props.eventManager} />
            </card>
        );
    }
});

var ButtonModule = React.createClass({
    getInitialState: function () {
        return {
            mode: 0
        }
    },
    render: function () {
        var self = this;
        var custom_style = Config['customStyle']['button'];
        EventCenter.bind('updateView', (function(self){
            return function (attr, value) {
                EventCenter.unbind('updateView');
                self.setState({mode:1});
            }
        })(self));
        return (
            <button style={custom_style}>button</button>
        );
    }
});



var GeneratorPreview = React.createClass({
    getInitialState: function () {
        return {
            custom_style: {
            }
        }
    },
    render: function () {
        var style = {
            height: '400px'
        };
        var module;
        this.props.eventManager.bind('test', (function(self){
            return function (module, caller) {
                console.log(self.props);
                console.log(caller);
                console.log(module);
            }
        })(this));
        switch (this.props.mode) {
            case 'button':
                module = <ButtonModule />;
                break;
            case 'card':
                module = <card>{'card'}</card>;
                break;
            default:
                module = <grid>{'grid'}</grid>;
                break;
        };
        return (
            <card style={style}>
                <center>
                    {module}
                </center>
            </card>
        );
    }
});

var Generator = React.createClass({
    _cnt: 0,
    getInitialState: function(){
        return {
            module: this.props.config.modules[0]
        }
    },
    loadModule: function(module) {
        return this.setState({
            module: module
        });
    },
    render: function() {
        this._cnt+=1;
        var eventManager = new MicroEvent();
        console.log('Generator %dth init', this._cnt);
        var config = this.props.config;
        return (
            <div>
                <GeneratorSpecs modules={config.modules} mode={this.state.module}
                    load={this.loadModule} eventManager={eventManager} />
                <GeneratorPreview mode={this.state.module} eventManager={eventManager}/>
            </div>
        );
    }
});

var config = {
    modules: ['button', 'grid', 'card', 'popover'],
};

ReactDOM.render(
    <Generator config={config} />,
    document.getElementById('generator')
);
