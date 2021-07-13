const tocState = {
    visibility: false,
    activeLayers: null
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
        default:
            return state;
    };
};