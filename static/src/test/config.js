var Config = {
    defaultStyle: {
        'button': {
            padding: "100px",
            outline: "0",
            borderRadius: "50%",
            border: "0",
            boxShadow: "0",
            fontSize: "30px",
            background: "#7fb981",
            color: "white",
            opacity: 0.6,
            fontFamily: "'Raleway', sans-serif",
            position: 'relative',
            cursor: 'pointer'
        },
        'grid': {
            position: 'relative',
            width: '100%',
            background: '#b9b9b9',
            minHeight: '100px',
            padding: '120px 180px',
            display: 'block',
            overflow: 'auto',
            boxSizing: 'border-box'
        }
    },
    modules: {
        'structure': ['grid', 'row', 'box'],
        'component': ['card', 'button', 'span', 'input']
    }

};

Config['customStyle'] = Config['defaultStyle'];

var Buffer = {
    drag: {},
    highlight: [],
};
