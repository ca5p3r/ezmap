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
export const setLayers = (x) => {
    return {
        type: 'setLayers',
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
export const triggerBookmarks = (x = false) => {
    return {
        type: 'triggerBookmarks',
        payload: x
    };
};
export const showWorkspace = () => {
    return {
        type: 'showWorkspace'
    };
};
export const hideWorkspace = () => {
    return {
        type: 'hideWorkspace'
    };
};
export const updateLayers = (x) => {
    return {
        type: 'updateLayers',
        payload: x
    };
};
export const resetLayers = () => {
    return {
        type: 'resetLayers'
    };
};
export const addPendingLayer = (x) => {
    return {
        type: 'addPendingLayer',
        payload: x
    };
};
export const resetPendingLayer = () => {
    return {
        type: 'resetPendingLayer'
    };
};
export const showTOC = () => {
    return {
        type: 'showTOC'
    };
};
export const hideTOC = () => {
    return {
        type: 'hideTOC'
    };
};
export const triggerChange = () => {
    return {
        type: 'triggerChange'
    };
};
export const disableChange = () => {
    return {
        type: 'disableChange'
    };
};
export const showToast = () => {
    return {
        type: 'showToast'
    };
};
export const hideToast = () => {
    return {
        type: 'hideToast'
    };
};
export const setMessage = (x) => {
    return {
        type: 'setMessage',
        payload: x
    };
};
export const setToastColor = (x) => {
    return {
        type: 'setToastColor',
        payload: x
    };
};
export const insertHistoricalLayer = (x) => {
    return {
        type: 'insertHistoricalLayer',
        payload: x
    };
};
export const setMapExtent = (x) => {
    return {
        type: 'setMapExtent',
        payload: x
    };
};
export const resetMapExtent = () => {
    return {
        type: 'resetMapExtent'
    };
};