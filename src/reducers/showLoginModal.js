export const showLoginModalReducer = (
    state = false,
    action
) => {
    switch (action.type) {
        case 'ShowLogin':
            return state = true;
        case 'HideLogin':
            return state = false;
        default:
            return state;
    };
};