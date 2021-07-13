const tocState = {
    visibility: false,
    activeLayers: null,
    orderChanged: false
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
        case 'orderOn':
            return {
                ...state,
                orderChanged: true
            };
        case 'orderOff':
            return {
                ...state,
                orderChanged: false
            };
        default:
            return state;
    };
};