export const login = () => {
    return {
        type: 'LOGIN'
    };
};

export const logout = () => {
    return {
        type: 'LOGOUT'
    };
};

export const showlogin = () => {
    return {
        type: 'ShowLogin'
    };
};

export const hidelogin = () => {
    return {
        type: 'HideLogin'
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