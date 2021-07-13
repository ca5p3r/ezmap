const mapInfoState = {
    cursorCenter: [0, 0],
    mapCenter: [3379498.795126273, 3114399.982142698],
    mapZoom: 6.8282764481106195,
    activeLayers: []
};

export const mapInfoReducer = (
    state = mapInfoState,
    action
) => {
    switch (action.type) {
        case 'setCursor':
            return {
                ...state,
                cursorCenter: action.payload
            };
        case 'setMapCenter':
            return {
                ...state,
                mapCenter: action.payload
            };
        case 'setMapZoom':
            return {
                ...state,
                mapZoom: action.payload
            };
        case 'setLayers':
            return {
                ...state,
                activeLayers: action.payload
            }
        default:
            return state;
    };
};