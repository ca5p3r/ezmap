const myState = {
    visibility: false
};
export const simpleSearchReducer = (
    state = myState,
    action
) => {
    switch (action.type) {
        case 'triggerSimpleSearch':
            return {
                ...state,
                visibility: action.payload
            };
        default:
            return state;
    };
};