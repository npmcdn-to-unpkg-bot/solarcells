var MicroEvent = function () {};
MicroEvent.prototype = {
    _events: function () {
        console.log(this._events);
    },
    bind: function(event, fct) {
        // Init at start or when all listeners removed
        this._events = this._events || {};
        this._events[event] = this._events[event] || [];
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
    }
};

var EventCenter = new MicroEvent();

// DnD
var Buffer = [];

EventCenter.drag_cnt = 0;

EventCenter.bind('onDragStart', function (module) {
    Buffer.push(module);
    this.drag_cnt+=1;
    console.log(Buffer, this.drag_cnt);
    EventCenter.bind('onDropFilter', function (parent){
        EventCenter.unbind('onDropFilter');
        parent.append(Buffer.pop(0), parent);
    });
});



//Utils
var clone = function (obj) {
    return JSON.parse(JSON.stringify(obj));
}

var Config = {
    defaultStyle: {
        'button': {
            marginTop: "10%",
            padding: "80px 24px",
            outline: "0 !important",
            borderRadius: "50%",
            border: "0",
            boxShadow: "0",
            fontSize: "30px",
            background: "#7fb981",
            color: "white",
            opacity: 0.6,
            fontFamily: "'Raleway', sans-serif"
        },
    },
    modules: {
        'structure': ['grid', 'row', 'box'],
        'component': ['card', 'button', 'span', 'input']
    }

};

Config['customStyle'] = Config['defaultStyle'];




$(document).ready(function(){
    $('#preload-content').css({
        opacity:1
    });
});

var ModuleNav = React.createClass({
    render: function () {
        var self = this;
        var c_categ = self.props.mode.categ;
        var c_name = self.props.mode.module;

        var structure = ['structure', 'component'].map(function(categ, i){
            var load = function () {
                self.props.load(categ, Config.modules[categ][0]);
            }
            if (categ == c_categ) {
                return <button className='active' onClick={load} key={i}>{categ}</button>;
            } else {
                return <button onClick={load} key={i}>{categ}</button>;
            }
        });

        var len = self.props.modules.length;
        var style = {
            width: (100/len)+'%'
        };
        var component = self.props.modules.map(function(name, i){
            var load = function () {
                self.props.load(c_categ, name);
            }
            if (name == c_name) {
                return <button className='active' style={style} onClick={load} key={i}>{name}</button>;
            } else {
                return <button style={style} onClick={load} key={i}>{name}</button>;
            }
        });
        return (
            <div className='Grid' id='module-nav'>
                <div className='structure Row'>
                    {structure}
                </div>
                <div className='component Row'>
                    {component}
                </div>
            </div>
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
            <tr>
                <th>
                    <span>{this.props.name}&nbsp;&nbsp;</span>
                </th>
                <th>
                    <input onChange={this.onChange} value={this.state.text}/>
                </th>
            </tr>
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
                <LiveInput mode={'button'} name={key} params={style[key]} key={i}/>
            );
        }
        return (
            <table>
                <tbody>
                    {inputGroup}
                </tbody>
            </table>
        );
    }
});

var ModuleManager = React.createClass({
    render: function () {
        var module;
        switch (this.props.mode.module) {
            case 'button':
                module = <ButtonSpecs />
                break;
            default:
                module = <div className='Box'>{this.props.mode.module}</div>
                break;
        }
        return (module);
    }
});

var GeneratorSpecs = React.createClass({
    render: function () {
        var style = {
            boxShadow: '0px 0px 8px rgba(58, 58, 58, 0.74)',
            background: 'rgba(101,87,87,0.75)',
            position: 'absolute',
            top: '10px',
            bottom: '10px',
            left: '10px',
            right: '10px',
            overflowY: 'hidden',
            borderRadius: '1px'
        }
        return (
            <div className="Card">
                <div className='Box' style={style}>
                    <ModuleNav modules={this.props.modules} mode={this.props.mode}
                        load={this.props.load} />
                    <ModuleManager mode={this.props.mode} />
                </div>
            </div>
        );
    }
});

var ButtonModule = React.createClass({
    render: function () {
        var style = clone(Config.customStyle.button);

        EventCenter.bind('updateView', (function(self){
            return function (attr, value) {
                EventCenter.unbind('updateView');
                self.setState({});
            }
        })(this));

        var onDragStart = function (event) {
            var drag_id = 'drop_'+EventCenter.drag_cnt;
            var elem = React.createElement('button', {style: style, key: drag_id}, 'button');
            EventCenter.trigger('onDragStart', elem);
        }

        return (
            <button draggable='true' onDragStart={onDragStart} style={style}>button</button>
        );
    }
});





var GeneratorPreview = React.createClass({
    render: function () {
        var style = {};
        var module;
        switch (this.props.mode) {
            case 'button':
                module = <ButtonModule test={'hello'}/>;
                break;
            case 'card':
                module = <div className="Card">{'card'}</div>;
                break;
            case 'drag':
                module = <div className="Card">{"I'm flying!"}</div>;
                break;
            default:
                module = <div className='Grid'>{'grid'}</div>;
                break;
        };
        return (
            <div className="Card">
                <div className='Center'>
                    {module}
                </div>
            </div>
        );
    }
});

var Generator = React.createClass({
    _cnt: 0,
    getInitialState: function(){
        return {
            categ: 'component',
            module: 'button'
        }
    },
    loadModule: function(categ, module) {
        return this.setState({
            categ: categ,
            module: module
        });
    },
    render: function() {
        this._cnt+=1;
        console.log('Generator %dth init', this._cnt);
        var mode = clone(this.state);
        return (
            <div>
                <GeneratorSpecs modules={Config.modules[mode.categ]} mode={mode}
                    load={this.loadModule} />
                <GeneratorPreview mode={this.state.module}/>
            </div>
        );
    }
});

ReactDOM.render(
    <Generator />,
    document.getElementById('generator')
);

var Gear = React.createClass({
    getInitialState: function() {
        return {
            children: [<div className='Row' key={1}>hello</div>, <div className='Row' key={2}>hello again</div>]
        }
    },
    drop: function (event) {
        console.log(this.props);
        event.preventDefault();
        EventCenter.trigger('onDropFilter', this);
    },
    onDragOver: function (event) {
        event.preventDefault();
    },
    append: function (newChild, self) {
        var childrenArray = this.state.children.slice(0);
        childrenArray.push(newChild);
        this.setState({
            children: childrenArray
        });
    },
    render: function () {
        return (
            <div className={this.props.className} onDrop={this.drop} onDragOver={this.onDragOver}>
                {this.state.children}
            </div>
        );
    }
});

var Layout = React.createClass({
//     getInitialState: function () {
//         return {
//             dom: <div className='main-view Box' onDrop={()}>hello</div>
//         }
//     },
    render: function () {
        // var depth = Object.keys(this.state);
        // for (var i = 0; i < depth.length; i++) {
        //     var lvl = depth[i];
        //     console.log(this.state[lvl]);
        // }
        // var drop = function (event) {
        //     event.preventDefault();
        //     EventCenter.trigger('onDropFilter', event.target);
        // }
        // var onDragOver = function (event) {
        //     event.preventDefault();
        // }
        // var base = <div onDrop={drop} onDragOver={onDragOver}>hello world</div>;
        return (
            <Gear className='main-view Box' />
        );
    }
});

ReactDOM.render(
    <Layout />,
    document.getElementById('layout')
);
