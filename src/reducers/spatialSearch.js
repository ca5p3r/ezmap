const myState = {
    enabled: false,
    visibility: false,
    result: []
};
export const spatialSearchReducer = (
    state = myState,
    action = {}
) => {
    switch (action.type) {
        case 'triggerSpatialSearch':
            return {
                ...state,
                enabled: action.payload
            };
        case 'triggerSpatialSearchVisibility':
            return {
                ...state,
                visibility: action.payload
            };
        case 'setSpatialResult':
            return {
                ...state,
                result: action.payload
            };
        case 'clearSpatialResult':
            return {
                ...state,
                result: []
            };
        default:
            return state;
    }
};