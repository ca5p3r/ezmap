const myState = {
    isLogged: false,
    showLoginModal: false
}
export const loginReducer = (
    state = myState,
    action
) => {
    switch (action.type) {
        case 'setLogin':
            return {
                ...state,
                isLogged: true
            };
        case 'setLogout':
            return {
                ...state,
                isLogged: false
            };
        case 'showLogin':
            return {
                ...state,
                showLoginModal: true
            };
        case 'hideLogin':
            return {
                ...state,
                showLoginModal: false
            };
        default:
            return state;
    };
};