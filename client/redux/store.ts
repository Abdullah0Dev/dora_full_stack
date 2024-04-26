import { configureStore, combineReducers } from "@reduxjs/toolkit";
import bookmarkReducer from "./bookmark/bookmarkSlice";

const rootReducer = combineReducers({
  bookmark: bookmarkReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;
