var Config = {
    defaultStyle: {
        'button': {
            padding: "50px",
            borderRadius: "50%",
            border: "0",
            boxShadow: "0",
            fontSize: "30px",
            background: "#7fb981",
            color: "white",
            opacity: 0.6,
        },
        'grid': {
            width: '100%',
            background: '#b9b9b9',
            padding: '10px',
        }
    },
    'customStyle': {
        'button': {},
        'grid': {},
    },
    modules: {
        'structure': ['grid', 'row', 'box'],
        'component': ['card', 'button', 'span', 'input']
    },
    info: {
        button: 'Wrapped in a box element',
        grid: 'Can be wrapped in a row element'
    }
};

// Config['customStyle'] = Config['defaultStyle'];

var Buffer = {
    drag: {},
    highlight: [],
};
