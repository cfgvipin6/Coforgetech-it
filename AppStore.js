import { createStore, applyMiddleware } from "redux";
import { AppReducer } from "./AppReducer";
import thunk from "redux-thunk";
export const AppStore = createStore(AppReducer, applyMiddleware(thunk));
//console.log("Store is ===>  " + JSON.stringify(AppStore.getState()));
