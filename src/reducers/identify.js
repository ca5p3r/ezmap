const myState = {
    enabled: false,
    visibility: false
};
export const identifyReducer = (
    state = myState,
    action
) => {
    switch (action.type) {
        case 'triggerIdentify':
            return {
                ...state,
                enabled: action.payload
            };
        default:
            return state;
    };
};