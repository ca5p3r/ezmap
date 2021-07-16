const toastState = {
    visibility: false,
    title: '',
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
                message: action.payload.message,
                title: action.payload.title
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