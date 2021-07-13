const myState = {
    showWorkspaceModal: false,
    layers: []
}
export const workspaceReducer = (
    state = myState,
    action
) => {
    switch (action.type) {
        case 'showWorkspace':
            return {
                ...state,
                showWorkspaceModal: true
            };
        case 'hideWorkspace':
            return {
                ...state,
                showWorkspaceModal: false
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
        default:
            return state;
    };
};