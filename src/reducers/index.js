import { combineReducers } from "redux";
import { isLoggedReducer } from "./isLogged";
import { showLoginModalReducer } from "./showLoginModal";
import { mapInfoReducer } from './map';

export const reducers = combineReducers({
    isLogged: isLoggedReducer,
    showLoginModal: showLoginModalReducer,
    mapInfo: mapInfoReducer
});