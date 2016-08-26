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





var Photo = React.createClass({
  toggleLiked: function() {
    this.setState({
      liked: !this.state.liked
    });
  },

  getInitialState: function() {
    return {
      liked: false
    };
  },

  render: function() {
    var buttonClass = this.state.liked ? 'active' : '';
    return (
      <div className='photo'>
        <div className='bar'>
          <button onClick={this.toggleLiked} className={buttonClass}>
            ♥
          </button>
          <span>{this.props.caption}</span>
        </div>
      </div>
    );
  }
});

var PhotoGallery = React.createClass({

  render: function() {

    var photos = this.props.photos.map(function(photo, i) {
      return <Photo src={photo.url} caption={photo.caption} key={i}/>
    });

    return (
      <div className='photo-gallery'>
        {photos}
      </div>
    );
  }
});

var data = [
  {
    url: 'http://tinyurl.com/lkevsb9',
    caption: 'Hong Kong!'
  },
  {
    url: 'http://tinyurl.com/mxkwh56',
    caption: 'Cows'
  },
  {
    url: 'http://tinyurl.com/nc7jv28',
    caption: 'Scooters'
  }
];

ReactDOM.render(<PhotoGallery photos={data} />, document.getElementById('example2'));

var ModuleNav = React.createClass({
    render: function () {
        var props = this.props;
        var modules = props.modules.map(function(name, i){
            var load = function () {
                props.load(name);
                props.eventManager.trigger('test', name, this);
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

var GeneratorSpecs = React.createClass({
    render: function () {
        var style = {
            height: '400px'
        };
        return (
            <card>
                <ModuleNav modules={this.props.modules} mode={this.props.mode}
                    load={this.props.load} eventManager={this.props.eventManager}/>
                <row style={style} />
            </card>
        );
    }
});

var ButtonModule = React.createClass({
    getInitialState: function () {
        return {
            custom_style: {
            }
        }
    },
    render: function () {
        return
    }
})


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
                module = <button>{'button'}</button>;
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
})

var config = {
    modules: ['button', 'grid', 'card', 'popover']
};

ReactDOM.render(
    <Generator config={config} />,
    document.getElementById('generator')
);
