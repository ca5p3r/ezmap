const myState = {
    visibility: false,
    list: []
};
export const bookmarksReducer = (
    state = myState,
    action
) => {
    let list = state.list;
    switch (action.type) {
        case 'addBookmark':
            list.push(action.payload);
            return {
                ...state,
                list
            };
        case 'removeBookmark':
            let newList = list.filter(bookmark => bookmark.title !== action.payload);
            return {
                ...state,
                list: newList
            };
        case 'removeAllBookmarks':
            return {
                ...state,
                list: []
            };
        case 'showBookmarks':
            return {
                ...state,
                visibility: true
            };
        case 'hideBookmarks':
            return {
                ...state,
                visibility: false
            };
        default:
            return state;
    };
};