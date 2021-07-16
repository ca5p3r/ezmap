const tocState = {
    visibility: false,
    activeLayers: null,
    comonentChanged: false,
    historicalData: []
};
export const tocReducer = (
    state = tocState,
    action
) => {
    switch (action.type) {
        case 'setLayers':
            return {
                ...state,
                activeLayers: action.payload
            }
        case 'showTOC':
            return {
                ...state,
                visibility: true
            };
        case 'hideTOC':
            return {
                ...state,
                visibility: false
            };
        case 'triggerChange':
            return {
                ...state,
                comonentChanged: true
            };
        case 'disableChange':
            return {
                ...state,
                comonentChanged: false
            };
        case 'insertHistoricalLayer':
            let data = state.historicalData;
            data.push(action.payload);
            return {
                ...state,
                historicalData: data
            };
        default:
            return state;
    };
};