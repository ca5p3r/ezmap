const myState = {
    cursorCenter: [0, 0],
    mapCenter: [0, 0],
    mapZoom: 0,
    defaultExtent: [],
    mapExtent: [],
    clickedPoint: [],
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
        case 'setDefaultExtent':
            return {
                ...state,
                defaultExtent: action.payload
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
        case 'setClickedPoint':
            return {
                ...state,
                clickedPoint: action.payload
            };
        default:
            return state;
    };
};