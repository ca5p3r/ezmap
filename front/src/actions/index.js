import { v4 as uuidv4 } from 'uuid';

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
export const setMapCenter = (x = null) => {
    return {
        type: 'setMapCenter',
        payload: x
    };
};
export const setMapZoom = (x = []) => {
    return {
        type: 'setMapZoom',
        payload: x
    };
};
export const setActiveLayers = (x = []) => {
    return {
        type: 'setActiveLayers',
        payload: x
    };
};
export const setCursor = (x = []) => {
    return {
        type: 'setCursor',
        payload: x
    };
};
export const setBookmarks = (x = []) => {
    return {
        type: 'setBookmarks',
        payload: x
    };
};
export const removeBookmark = (x = null) => {
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
export const addBookmark = (x = null) => {
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
export const updateLayers = (x = []) => {
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
export const addPendingLayer = (x = null) => {
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
    const toastID = uuidv4();
    return {
        type: 'triggerToast',
        payload: { ...x, toastID }
    };
};
export const insertHistoricalLayer = (x = {}) => {
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
export const setDefaultExtent = (x = []) => {
    return {
        type: 'setDefaultExtent',
        payload: x
    };
};
export const setMapExtent = (x = []) => {
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
export const triggerSpatialSearch = (x = false) => {
    return {
        type: 'triggerSpatialSearch',
        payload: x
    };
};
export const triggerIsLoading = (x = false) => {
    return {
        type: 'triggerIsLoading',
        payload: x
    };
};
export const setClickedPoint = (x = []) => {
    return {
        type: 'setClickedPoint',
        payload: x
    };
};
export const setDrawnPolygon = (x = []) => {
    return {
        type: 'setDrawnPolygon',
        payload: x
    };
};
export const setResult = (x = []) => {
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
export const setSpatialResult = (x = []) => {
    return {
        type: 'setSpatialResult',
        payload: x
    };
};
export const clearSpatialResult = () => {
    return {
        type: 'clearSpatialResult'
    };
};
export const triggerIdentifyVisibility = (x = false) => {
    return {
        type: 'triggerIdentifyVisibility',
        payload: x
    };
};
export const triggerSpatialSearchVisibility = (x = false) => {
    return {
        type: 'triggerSpatialSearchVisibility',
        payload: x
    };
};
export const triggerShowLocalization = (x = false) => {
    return {
        type: 'triggerShowLocalization',
        payload: x
    };
};
export const setLocalizedLayer = (x = null) => {
    return {
        type: 'setLocalizedLayer',
        payload: x
    };
};
export const triggerSimpleSearch = (x = false) => {
    return {
        type: 'triggerSimpleSearch',
        payload: x
    };
};