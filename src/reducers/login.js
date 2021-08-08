const myState = {
    isLogged: false,
    user: null,
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
        case 'setUser':
            return {
                ...state,
                user: action.payload
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