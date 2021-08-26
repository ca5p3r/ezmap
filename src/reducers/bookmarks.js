const myState = {
    visibility: false,
    list: []
};
export const bookmarksReducer = (
    state = myState,
    action
) => {
    const list = state.list;
    switch (action.type) {
        case 'addBookmark':
            const newList = Array.from(list);
            newList.push(action.payload);
            return {
                ...state,
                list: newList
            };
        case 'removeBookmark':
            const updatedList = list.filter(bookmark => bookmark.title !== action.payload);
            return {
                ...state,
                list: updatedList
            };
        case 'removeAllBookmarks':
            return {
                ...state,
                list: []
            };
        case 'triggerBookmarks':
            return {
                ...state,
                visibility: action.payload
            };
        case 'setBookmarks':
            return {
                ...state,
                list: action.payload
            };
        default:
            return state;
    };
};