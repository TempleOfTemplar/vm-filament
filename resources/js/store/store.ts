// import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit';
// import {combineReducers} from "redux";
// import {tasksAPI} from "../services/TasksService";
// import {toysAPI} from "../services/ToysService";
// import {categoriesAPI} from "../services/CategoriesService";
// import {api} from "../services/AuthService";
// import auth from "./reducers/AuthSlice";
//
// const rootReducer = combineReducers(
//     {
//         // tasksReducer
//         [tasksAPI.reducerPath]: tasksAPI.reducer,
//         [toysAPI.reducerPath]: toysAPI.reducer,
//         [categoriesAPI.reducerPath]: categoriesAPI.reducer,
//         [api.reducerPath]: api.reducer,
//         auth
//     }
// );
//
// export const store = configureStore({
//     reducer: rootReducer,
//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware().concat(tasksAPI.middleware, toysAPI.middleware, categoriesAPI.middleware, api.middleware)
// })
//
// // Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>
// // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// export type AppDispatch = typeof store.dispatch
//
// export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
//     RootState,
//     unknown,
//     Action<string>>;
