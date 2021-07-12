export const login = () => {
    return {
        type: 'setLogin'
    };
};

export const logout = () => {
    return {
        type: 'setLogout'
    };
};

export const showlogin = () => {
    return {
        type: 'showLogin'
    };
};

export const hidelogin = () => {
    return {
        type: 'hideLogin'
    };
};

export const setMapCenter = (x) => {
    return {
        type: 'setMapCenter',
        payload: x
    };
};

export const setMapZoom = (x) => {
    return {
        type: 'setMapZoom',
        payload: x
    };
};

export const setCursor = (x) => {
    return {
        type: 'setCursor',
        payload: x
    };
};

export const removeBookmark = (x) => {
    return {
        type: 'removeBookmark',
        payload: x
    };
};

export const removeAllBookmarks = () => {
    return {
        type: 'removeAllBookmarks'
    };
};

export const addBookmark = (x) => {
    return {
        type: 'addBookmark',
        payload: x
    };
};

export const showBookmarks = () => {
    return {
        type: 'showBookmarks'
    };
};

export const hideBookmarks = () => {
    return {
        type: 'hideBookmarks'
    };
};