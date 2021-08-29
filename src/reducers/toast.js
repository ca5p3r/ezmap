const myState = {
    visibility: false,
    title: '',
    message: '',
    color: ''
};
export const toastReducer = (
    state = myState,
    action = {}
) => {
    if (action.type === 'triggerToast') {
        return {
            ...state,
            message: action.payload.message ? action.payload.message : '',
            title: action.payload.title ? action.payload.title : '',
            visibility: action.payload.visible ? action.payload.visible : false,
            color: action.payload.title ? action.payload.title.toLowerCase() : ''
        };
    }
    else {
        return state;
    }
};