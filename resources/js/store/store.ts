import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit';
import {combineReducers} from "redux";
import {tasksApi} from "./reducers/TasksSlice";
import {toysApi} from "./reducers/ToysSlice";
import {categoriesApi} from "./reducers/CategoriesSlice";
import rootApi from "./api/RootApi";

const rootReducer = combineReducers(
    {
        // tasksReducer
        [tasksApi.reducerPath]: tasksApi.reducer,
        [toysApi.reducerPath]: toysApi.reducer,
        [categoriesApi.reducerPath]: categoriesApi.reducer
    }
);

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(rootApi.middleware, tasksApi.middleware, toysApi.middleware, categoriesApi.middleware)
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
    RootState,
    unknown,
    Action<string>>;
