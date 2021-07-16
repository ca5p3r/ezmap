const myState = {
    isLogged: false,
    visibility: false
};
export const loginReducer = (
    state = myState,
    action
) => {
    switch (action.type) {
        case 'triggerLogin':
            return {
                ...state,
                isLogged: action.payload
            };
        case 'triggerShowLogin':
            return {
                ...state,
                visibility: action.payload
            };
        default:
            return state;
    };
};