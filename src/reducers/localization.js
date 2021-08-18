const myState = {
    visibility: false,
    layerID: null
};
export const localizationReducer = (
    state = myState,
    action
) => {
    switch (action.type) {
        case 'triggerShowLocalization':
            return {
                ...state,
                visibility: action.payload
            };
        case 'setLocalizedLayer':
            return {
                ...state,
                layerID: action.payload
            };
        default:
            return state;
    };
};