import { combineReducers } from "redux";
import { loginReducer } from "./login";
import { mapInfoReducer } from './map';
import { bookmarksReducer } from "./bookmarks";
import { workspaceReducer } from './workspace'

export const reducers = combineReducers({
    login: loginReducer,
    mapInfo: mapInfoReducer,
    bookmarks: bookmarksReducer,
    workspace: workspaceReducer
});