const tocState = {
    visibility: false,
    activeLayers: null,
    comonentChanged: false
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
        default:
            return state;
    };
};