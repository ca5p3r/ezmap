const myState = {
    cursorCenter: [0, 0],
    mapCenter: [3379498.795126273, 3114399.982142698],
    mapZoom: 6.8282764481106195,
    defaultExtent: [2099724.358397806, 2504130.7943378426, 4659273.23185474, 3724669.1699475534],
    mapExtent: [],
    isLoading: false
};
export const mapInfoReducer = (
    state = myState,
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
        case 'setMapExtent':
            return {
                ...state,
                mapExtent: action.payload
            };
        case 'resetMapExtent':
            return {
                ...state,
                mapExtent: []
            };
        case 'triggerIsLoading':
            return {
                ...state,
                isLoading: action.payload
            };
        default:
            return state;
    };
};