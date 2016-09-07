// imported utils & config
var EventCenter = new MicroEvent();

EventCenter.bind('onDragStart', function (createModule) {
    Buffer.drag = createModule;
    this.drag_cnt+=1;
    EventCenter.update('onDropFilter', function (parent){
        var elem = createModule(parent.remove, parent.changeMode);
        parent.append(elem, parent);
    });
});


var ModuleNav = React.createClass({
    render: function () {
        var self = this;
        var c_categ = self.props.mode.categ;
        var c_name = self.props.mode.module;

        var structure = ['structure', 'component'].map(function(categ, i){
            var load = function () {
                EventCenter.unbind('updateView');
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
                EventCenter.unbind('updateView');
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
    componentWillReceiveProps: function(nextProps) {
        this.setState({
            text: nextProps.params
        });
    },
    onChange: function(e) {
        var attr = this.props.name;
        var value = e.target.value;
        this.setState({
            text: value
        });
        // Skip update when input is int
        if (!Number(value) || this.props.type === 'range') {
            if (this.props.type === 'range') {
                Config['customStyle'][this.props.mode][attr] = value+'px';
            } else {
                Config['customStyle'][this.props.mode][attr] = value;
            }
        }
        EventCenter.trigger('updateView');
    },
    render: function () {
        var module;
        switch (this.props.type) {
            case 'input':
                module = <th><input onChange={this.onChange} value={this.state.text} /></th>;
                break;
            case 'range':
                module = <th>
                            <input onChange={this.onChange} className='s-range' type="range" min="0" max="50" value={this.state.text} />
                            <input onChange={this.onChange} className='s-range-value' value={this.state.text} />
                        </th>;
                break;
            default:
                module = <th><input onChange={this.onChange} value={this.state.text} /></th>;
                break;
        }
        return (
            <tr>
                <th>
                    <span>{this.props.name}&nbsp;&nbsp;</span>
                </th>
                {module}
            </tr>
        );
    }
});

var Specs = React.createClass({
    render: function () {
        var mode = this.props.mode;
        var style = extend(Config['defaultStyle'][mode], Config['customStyle'][mode]);
        var attr = Object.keys(style);
        var inputGroup = [];
        // Input generate
        for (var i = 0; i < attr.length; i++) {
            var key = attr[i];
            var type = 'input';
            console.log(key);
            if (key == 'fontSize') type = 'range';
            // Mode -> Module | name -> group name | params -> [attr, value]
            inputGroup.push(
                <LiveInput mode={mode} name={key} params={style[key]} key={i} type={type}/>
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
                module = <Specs mode='button'/>
                break;
            case 'grid':
                module = <Specs mode='grid'/>
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
            background: 'rgba(101,87,87,0.25)',
            position: 'absolute',
            top: '10px',
            bottom: '10px',
            left: '10px',
            right: '10px',
            overflowY: 'hidden',
            borderRadius: '1px'
        }
        return (
            <div className="Card" id='specs'>
                <div className='Box' style={style}>
                    <ModuleNav modules={this.props.modules} mode={this.props.mode}
                        load={this.props.load} />
                    <ModuleManager mode={this.props.mode} />
                </div>
            </div>
        );
    }
});



// Component
var ButtonModule = React.createClass({
    componentFactory: function (remove, changeParentMode) {
        var style = clone(Config.customStyle.button);
        var drag_id = 'drop_'+EventCenter.drag_cnt;
        var bannerman = <button className='s-button' style={style} key={drag_id}>
                            <span className='Center'>button</span>
                       </button>;
        var elem = <Capsule className='s-box Capsule' id={drag_id} style={style} key={drag_id} remove={remove}
                     changeParentMode={changeParentMode} bannermen={[bannerman]}>
                   </Capsule>
        return elem;
    },
    onDragStart: function (event) {
        EventCenter.trigger('onDragStart', this.componentFactory);
    },
    render: function () {
        var style = extend(Config.defaultStyle.button, Config.customStyle.button);

        EventCenter.bind('updateView', (function(self){
            return function () {
                EventCenter.unbind('updateView');
                self.setState({});
            }
        })(this));

        return (
            <div className='s-box'>
                <button className='s-button s-center' draggable='true' onDragStart={this.onDragStart} style={style}>
                    <span className='Center'>button</span>
                </button>
            </div>
        );
    }
});


// Structure
var GridModule = React.createClass({
    // Init component with drop-parent attrs
    componentFactory: function (remove, changeParentMode) {
        var style = clone(Config.customStyle.grid);
        var drag_id = 'drop_'+EventCenter.drag_cnt;
        var bannerman = <span className='Center' key='0'>Content</span>;
        var elem = <Capsule className='s-grid Capsule' id={drag_id} style={style} key={drag_id} remove={remove}
                        changeParentMode={changeParentMode} bannermen={[bannerman]}>
                   </Capsule>;
        return elem;
    },
    // Cache the 'make component' method
    onDragStart: function (event) {
        EventCenter.trigger('onDragStart', this.componentFactory);
    },
    render: function () {
        // Merge custom with default
        var style = extend(Config.defaultStyle.grid, Config.customStyle.grid);

        // Triggerred by input from specs
        EventCenter.bind('updateView', (function(self){
            return function () {
                EventCenter.unbind('updateView');
                self.setState({}); // Refresh module
            }
        })(this));

        return (
            <div className='s-row'>
                <div className='Grid s-center' draggable='true' onDragStart={this.onDragStart} style={style}>
                    <span className='Center'>Content</span>
                </div>
            </div>
        );
    }
});





var GeneratorPreview = React.createClass({
    render: function () {
        var style = {};
        var module;
        // Load modules on mode
        // Modules that display and reproduce
        switch (this.props.mode) {
            case 'button':
                module = <ButtonModule />;
                break;
            case 'grid':
                module = <GridModule />;
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
            <div className="Card" id='preview'>
                {module}
            </div>
        );
    }
});

var Generator = React.createClass({
    _cnt: 0,
    getInitialState: function(){
        return {
            categ: 'structure',
            module: 'grid'
        }
    },
    // Reload different types of components
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
                <GeneratorSpecs modules={Config.modules[mode.categ]} mode={this.state}
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

var Capsule = React.createClass({
    getInitialState: function() {
        return {
            children: this.props.bannermen,
            mode: 'idle'
        }
    },
    drop: function (event) {
        event.preventDefault();
        EventCenter.once('onDropFilter', this);
    },
    onDragOver: function (event) {
        event.preventDefault();
    },
    append: function (newChild, self) {
        var childrenArray = self.state.children.slice(0);
        childrenArray.push(newChild);
        // console.log(self.props.id, childrenArray);

        // Prep for setting parent to idle
        self.setState({
            children: childrenArray,
            mode: 'exit'
        });
    },
    remove: function (id) {
        var id = Buffer.highlight.pop().props.id;
        var childrenArray = this.state.children.slice(0);
        var query_self = childrenArray.map(function(child){
            console.log(child.props.id);
            return child.props.id;
        });
        var index = query_self.indexOf(id);
        childrenArray.splice(index, 1);
        this.setState({
            children: childrenArray,
            mode: this.state.mode
        });
    },
    // Deprecated
    changeMode: function (mode) {
        if (this.props.id === 'drop_base') return;
        this.setState({
            children: this.state.children,
            mode: mode
        });
    },
    mouseEnter: function () {
        var mode = 'active';
        // Set parent to idle on drop
        if (this.state.mode === 'exit') mode='idle';
        this.setState({
            children: this.state.children,
            mode: mode
        });
        Buffer.highlight.push(this);
        console.log(this.props.id, 'pushing');
    },
    mouseLeave: function () {
        Buffer.highlight.pop();
        console.log(this.props.id, 'popping');
        this.setState({
            children: this.state.children,
            mode: 'idle'
        });
    },
    componentDidMount: function () {
        var self = this;
        var id = self.props.id;
        var dom = $('#'+id);
        if (id === 'drop_base') return;
        dom.unbind('mouseenter');
        dom.unbind('mouseleave');
        dom.bind('mouseenter', self.mouseEnter);
        dom.bind('mouseleave', self.mouseLeave);
    },
    render: function () {
        var children = this.state.children.slice();
        var className = this.props.className;
        if (this.props.id === 'drop_base') Buffer.root = this;
        if (this.state.mode === 'active') {
            // console.log(this.props, 'refreshing');
            if (Buffer.editorMode === 'remove') {
                var self = this;
                children.push(
                    <button className='delete' key={'delete'} onClick={self.props.remove}>
                        <span>&#x2715;</span>
                    </button>
                );
                className+= ' remove';
            } else if (Buffer.editorMode === 'select') {
                var self = this;
                var remove = function () {
                    // self.props.edit(self.props.id);
                }
                children.push(
                    <button className='edit' key={'edit'}>
                        <a></a>
                    </button>
                );
                className+= ' select';
            }
        }

        return (
            <div className={className} id={this.props.id} style={this.props.style} onDrop={this.drop} onDragOver={this.onDragOver} >
                {children}
            </div>
        );
    }
});

var Layout = React.createClass({
    getInitialState: function () {
        return {
            mode: 'remove'
        };
    },
    render: function () {
        var self = this;
        var bannermen = [];
        var toggleMode = function (mode) {
            self.setState({
                mode: mode
            });
        };
        if (this.state.mode === 'select') {
            var toggleMode = function () {self.setState({mode:'remove'})};
            var module = <div>
                            <div id='select'>
                                <button className='active'>Select</button>
                            </div>
                            <div id='remove'>
                                <button onClick={toggleMode}>Remove</button>
                            </div>
                        </div>;
        } else if (this.state.mode === 'remove') {
            var toggleMode = function () {self.setState({mode:'select'})};
            var module = <div>
                            <div id='select'>
                                <button onClick={toggleMode}>Select</button>
                            </div>
                            <div id='remove'>
                                <button className='active'>Remove</button>
                            </div>
                        </div>;
        }
        Buffer.editorMode = this.state.mode;
        return (
            <div id="view-wrap">
                <Capsule className='main-view Box' id={'drop_base'} bannermen={bannermen} />
                {module}
            </div>
        );
    }
});

ReactDOM.render(
    <Layout />,
    document.getElementById('layout')
);
