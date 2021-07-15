const toastState = {
    visibility: false,
    message: '',
    color: 'danger'
};
export const toastReducer = (
    state = toastState,
    action
) => {
    switch (action.type) {
        case 'showToast':
            return {
                ...state,
                visibility: true
            }
        case 'hideToast':
            return {
                ...state,
                visibility: false
            };
        case 'setMessage':
            return {
                ...state,
                message: action.payload
            };
        case 'resetMessage':
            return {
                ...state,
                message: ''
            };
        case 'setToastColor':
            return {
                ...state,
                color: action.payload
            };
        default:
            return state;
    };
};