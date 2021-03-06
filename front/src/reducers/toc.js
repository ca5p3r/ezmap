const myState = {
    visibility: false,
    activeLayers: null,
    comonentChanged: false,
    historicalData: []
};
export const tocReducer = (
    state = myState,
    action = {}
) => {
    switch (action.type) {
        case 'setActiveLayers':
            return {
                ...state,
                activeLayers: action.payload
            }
        case 'triggerShowTOC':
            return {
                ...state,
                visibility: action.payload
            };
        case 'triggerTOCChange':
            return {
                ...state,
                comonentChanged: action.payload
            };
        case 'insertHistoricalLayer':
            const data = state.historicalData;
            data.push(action.payload);
            return {
                ...state,
                historicalData: data
            };
        case 'setHistoricalLayers':
            return {
                ...state,
                historicalData: action.payload
            };
        default:
            return state;
    }
};