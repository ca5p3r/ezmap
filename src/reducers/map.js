const myState = {
    cursorCenter: [0, 0],
    mapCenter: [3379498.79, 3114399.98],
    mapZoom: 6.83,
    defaultExtent: [2099724.35, 2504130.79, 4659273.23, 3724669.16],
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