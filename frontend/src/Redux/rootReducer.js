import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./AuthReducer/authSlice";
import bookReducer from "./BooksReducer/bookSlices"

const rootReducer = combineReducers({
    auth: authReducer,
    books: bookReducer
});

export default rootReducer;