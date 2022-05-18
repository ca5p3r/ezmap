const myState = {
    visibility: false
};
export const registerReducer = (
    state = myState,
    action = {}
) => {
    if (action.type === 'triggerShowRegister') {
        return {
            ...state,
            visibility: action.payload
        };
    }
    else {
        return state;
    }
};