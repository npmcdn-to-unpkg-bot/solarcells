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

// setInterval(function(){
//     console.log(Buffer.highlight);
// }, 2000);



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
        if (!Number(value)) {
            Config['customStyle'][this.props.mode][attr] = value;
        }
        EventCenter.trigger('updateView');
    },
    render: function () {
        return (
            <tr>
                <th>
                    <span>{this.props.name}&nbsp;&nbsp;</span>
                </th>
                <th>
                    <input onChange={this.onChange} value={this.state.text} />
                </th>
            </tr>
        );
    }
});

var Specs = React.createClass({
    render: function () {
        var mode = this.props.mode;
        var style = Config['defaultStyle'][mode];
        var attr = Object.keys(style);
        var inputGroup = [];
        for (var i = 0; i < attr.length; i++) {
            var key = attr[i];
            inputGroup.push(
                <LiveInput mode={mode} name={key} params={style[key]} key={i} />
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



// Component
var ButtonModule = React.createClass({
    sendComponent: function (remove, changeParentMode) {
        var style = clone(Config.customStyle.button);
        var drag_id = 'drop_'+EventCenter.drag_cnt;
        var bannerman = <button className='Button' style={style} key={drag_id}>
                            <span className='Center'>button</span>
                       </button>;
        var elem = <Gear className='Box Gear' id={drag_id} style={style} key={drag_id} remove={remove} changeParentMode={changeParentMode}
                            bannermen={[bannerman]}>
                   </Gear>
        return elem;
    },
    onDragStart: function (event) {
        EventCenter.trigger('onDragStart', this.sendComponent);
    },
    render: function () {
        var style = clone(Config.customStyle.button);

        EventCenter.bind('updateView', (function(self){
            return function () {
                EventCenter.unbind('updateView');
                self.setState({});
            }
        })(this));

        return (
            <button className='Button' draggable='true' onDragStart={this.onDragStart} style={style}>
                <span className='Center'>button</span>
            </button>
        );
    }
});


// Structure
var GridModule = React.createClass({
    sendComponent: function (remove, changeParentMode) {
        var style = clone(Config.customStyle.grid);
        var drag_id = 'drop_'+EventCenter.drag_cnt;
        var bannerman = <span className='Center' key='0'>Content</span>;
        var elem = <Gear className='Grid Gear' id={drag_id} style={style} key={drag_id} remove={remove}
                        changeParentMode={changeParentMode} bannermen={[bannerman]}>
                   </Gear>;
        return elem;
    },
    onDragStart: function (event) {
        EventCenter.trigger('onDragStart', this.sendComponent);
    },
    render: function () {
        var style = clone(Config.customStyle.grid);

        // Triggerred by input from specs
        EventCenter.bind('updateView', (function(self){
            return function () {
                EventCenter.unbind('updateView');
                self.setState({}); // Refresh module
            }
        })(this));

        // Feed formulated object
        var onDragStart = function (event) {

        }

        return (
            <div className='Grid' draggable='true' onDragStart={this.onDragStart} style={style}>
                <span className='Center'>Content</span>
            </div>
        );
    }
});





var GeneratorPreview = React.createClass({
    render: function () {
        var style = {};
        var module;
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
            categ: 'structure',
            module: 'grid'
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

var Gear = React.createClass({
    getInitialState: function() {
        return {
            children: this.props.bannermen,
            mode: 'display'
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
        console.log(self.props.id, childrenArray);
        self.setState({
            children: childrenArray,
            mode: self.state.mode
        });
    },
    remove: function (id) {
        Buffer.highlight.pop();
        var childrenArray = this.state.children.slice(0);
        var query_self = childrenArray.map(function(child){
            return child.props.id;
        });
        var index = query_self.indexOf(id);
        childrenArray.pop(index);
        this.setState({
            children: childrenArray,
            mode: this.state.mode
        });
    },
    changeMode: function (mode) {
        if (this.props.id === 'drop_base') return;
        this.setState({
            children: this.state.children,
            mode: mode
        });
    },
    // deleteFromParent: function () {
    //     var self = Buffer.highlight.pop();
    //     var parentModule;
    //     if (Buffer.highlight.length === 0) {
    //         parentModule = Buffer.root;
    //     } else {
    //         parentModule = Buffer.highlight.slice(-1).pop();
    //     }
    //     // Delete logic fix || TODO: delete one element once
    //     if (parentModule.props.id === self.props.id) {
    //         console.log('called', Buffer.highlight);
    //         Buffer.highlight.pop();
    //         if (Buffer.highlight.length === 0) {
    //             parentModule = Buffer.root;
    //         } else {
    //             parentModule = Buffer.highlight.slice(-1).pop();
    //         }
    //     }
    //     console.log(parentModule.props.id, self.props.id);
    //     var childrenArray = parentModule.state.children.slice(0);
    //     var query_self = childrenArray.map(function(child){
    //         return child.props.id;
    //     });
    //     var index = query_self.indexOf(self.props.id);
    //     childrenArray.pop(index);
    //     parentModule.setState({
    //         children: childrenArray,
    //         mode: parentModule.state.mode
    //     });
    // },
    mouseEnter: function () {
        if (Buffer.highlight.length !== 0) {
            this.props.changeParentMode('display');
        }
        this.setState({
            children: this.state.children,
            mode: 'edit'
        });
        Buffer.highlight.push(this);
        // console.log('pushing');
    },
    mouseLeave: function () {
        Buffer.highlight.pop();
        // console.log('popping');
        this.setState({
            children: this.state.children,
            mode: 'display'
        });
        if (Buffer.highlight.length !== 0) {
            this.props.changeParentMode('edit');
        }
    },
    componentDidMount: function () {
        var self = this;
        if (self.props.id === 'drop_base') return;
        $('#'+self.props.id).bind('mouseenter', self.mouseEnter);
        $('#'+self.props.id).bind('mouseleave', self.mouseLeave);
    },
    render: function () {
        var children = this.state.children.slice();
        var className = this.props.className;
        if (this.props.id === 'drop_base') Buffer.root = this;
        if (this.state.mode === 'edit') {
            var self = this;
            var remove = function () {
                self.props.remove(self.props.id);
            }
            children.push(
                <button className='delete' key={'delete'} onClick={remove}>
                    &#x2715;
                </button>
            );
            className+= ' edit';
        }

        return (
            <div className={className} id={this.props.id} style={this.props.style} onDrop={this.drop} onDragOver={this.onDragOver} >
                {children}
            </div>
        );
    }
});

var Layout = React.createClass({
    render: function () {
        var bannermen = [];
        return (
            <Gear className='main-view Box' id={'drop_base'} bannermen={bannermen} />
        );
    }
});

ReactDOM.render(
    <Layout />,
    document.getElementById('layout')
);
