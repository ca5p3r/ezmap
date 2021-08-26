import { combineReducers } from "redux";
import { loginReducer } from "./login";
import { mapInfoReducer } from './map';
import { bookmarksReducer } from "./bookmarks";
import { workspaceReducer } from './workspace';
import { tocReducer } from './toc';
import { toastReducer } from "./toast";
import { identifyReducer } from "./identify";
import { registerReducer } from './register';
import { localizationReducer } from './localization';
import { simpleSearchReducer } from './simpleSearch';
import { spatialSearchReducer } from './spatialSearch';
export const reducers = combineReducers({
    login: loginReducer,
    mapInfo: mapInfoReducer,
    bookmarks: bookmarksReducer,
    workspace: workspaceReducer,
    toc: tocReducer,
    toast: toastReducer,
    identify: identifyReducer,
    register: registerReducer,
    localization: localizationReducer,
    simpleSearch: simpleSearchReducer,
    spatialSearch: spatialSearchReducer
});