const myState = {
    visibility: false
};
export const simpleSearchReducer = (
    state = myState,
    action = {}
) => {
    if (action.type === 'triggerSimpleSearch') {
        return {
            ...state,
            visibility: action.payload
        };
    }
    else {
        return state;
    }
};