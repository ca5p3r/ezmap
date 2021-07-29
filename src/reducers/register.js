const myState = {
    visibility: false
};
export const registerReducer = (
    state = myState,
    action
) => {
    switch (action.type) {
        case 'triggerShowRegister':
            return {
                ...state,
                visibility: action.payload
            };
        default:
            return state;
    };
};