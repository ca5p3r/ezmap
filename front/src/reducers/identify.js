const myState = {
    enabled: false,
    visibility: false,
    result: []
};
export const identifyReducer = (
    state = myState,
    action = {}
) => {
    switch (action.type) {
        case 'triggerIdentify':
            return {
                ...state,
                enabled: action.payload
            };
        case 'triggerIdentifyVisibility':
            return {
                ...state,
                visibility: action.payload
            };
        case 'setResult':
            return {
                ...state,
                result: action.payload
            };
        case 'clearResult':
            return {
                ...state,
                result: []
            };
        default:
            return state;
    }
};