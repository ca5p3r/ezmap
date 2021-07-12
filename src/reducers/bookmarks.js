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
            return {
                ...state,
                list: list.push(action.payload)
            };
        case 'removeBookmark':
            return {
                ...state,
                list: list.filter(bookmark => bookmark.title !== action.payload)
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