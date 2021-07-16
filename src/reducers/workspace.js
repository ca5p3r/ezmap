const myState = {
    visibility: false,
    layers: [],
    pendingLayer: {}
};

export const workspaceReducer = (
    state = myState,
    action
) => {
    switch (action.type) {
        case 'triggerShowWorkspace':
            return {
                ...state,
                visibility: action.payload
            };
        case 'updateLayers':
            return {
                ...state,
                layers: action.payload
            };
        case 'resetLayers':
            return {
                ...state,
                layers: []
            };
        case 'addPendingLayer':
            return {
                ...state,
                pendingLayer: action.payload
            };
        case 'resetPendingLayer':
            return {
                ...state,
                pendingLayer: {}
            };
        default:
            return state;
    };
};