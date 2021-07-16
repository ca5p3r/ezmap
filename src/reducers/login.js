const myState = {
    isLogged: false,
    showLoginModal: false
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
                showLoginModal: action.payload
            };
        default:
            return state;
    };
};