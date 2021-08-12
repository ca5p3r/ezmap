export const triggerLogin = (x = false) => {
    return {
        type: 'triggerLogin',
        payload: x
    };
};
export const setUser = (x = null) => {
    return {
        type: 'setUser',
        payload: x
    };
};
export const setUserID = (x = null) => {
    return {
        type: 'setUserID',
        payload: x
    };
};
export const triggerShowLogin = (x = false) => {
    return {
        type: 'triggerShowLogin',
        payload: x
    };
};
export const triggerShowRegister = (x = false) => {
    return {
        type: 'triggerShowRegister',
        payload: x
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
export const setActiveLayers = (x) => {
    return {
        type: 'setActiveLayers',
        payload: x
    };
};
export const setCursor = (x) => {
    return {
        type: 'setCursor',
        payload: x
    };
};
export const setBookmarks = (x) => {
    return {
        type: 'setBookmarks',
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
export const triggerShowWorkspace = (x = false) => {
    return {
        type: 'triggerShowWorkspace',
        payload: x
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
export const triggerShowTOC = (x = false) => {
    return {
        type: 'triggerShowTOC',
        payload: x
    };
};
export const triggerTOCChange = (x = false) => {
    return {
        type: 'triggerTOCChange',
        payload: x
    };
};
export const triggerToast = (x = {}) => {
    return {
        type: 'triggerToast',
        payload: x
    };
};
export const insertHistoricalLayer = (x) => {
    return {
        type: 'insertHistoricalLayer',
        payload: x
    };
};
export const setHistoricalLayers = (x = []) => {
    return {
        type: 'setHistoricalLayers',
        payload: x
    };
};
export const setDefaultExtent = (x) => {
    return {
        type: 'setDefaultExtent',
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
export const triggerIdentify = (x = false) => {
    return {
        type: 'triggerIdentify',
        payload: x
    };
};
export const triggerIsLoading = (x = false) => {
    return {
        type: 'triggerIsLoading',
        payload: x
    };
};
export const setClickedPoint = (x) => {
    return {
        type: 'setClickedPoint',
        payload: x
    };
};
export const setResult = (x) => {
    return {
        type: 'setResult',
        payload: x
    };
};
export const clearResult = () => {
    return {
        type: 'clearResult'
    };
};
export const triggerIdentifyVisibility = (x = false) => {
    return {
        type: 'triggerIdentifyVisibility',
        payload: x
    };
};