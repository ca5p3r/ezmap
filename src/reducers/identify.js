const myState = {
    enabled: false,
    visibility: false,
    result: []
};
export const identifyReducer = (
    state = myState,
    action
) => {
    const result = state.result;
    switch (action.type) {
        case 'triggerIdentify':
            return {
                ...state,
                enabled: action.payload
            };
        case 'triggerIdentifyVisibility':
            return {
                ...state,
                visibility: action.payload
            };
        case 'setResult':
            const newArr = [...result]
            newArr.push(action.payload);
            return {
                ...state,
                result: newArr
            };
        case 'clearResult':
            return {
                ...state,
                result: []
            };
        default:
            return state;
    };
};