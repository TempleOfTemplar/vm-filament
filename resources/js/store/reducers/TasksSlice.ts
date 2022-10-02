import {createSlice} from "@reduxjs/toolkit";
import {Task} from "../../Models/Task";

interface TasksState {
    tasks: Task[];
    isLoading: boolean;
    error: string;
}

const initialState: TasksState = {
    tasks: [],
    isLoading: false,
    error: ''
};

export const tasksSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        // tasksFetching(state) {
        //     state.isLoading = true;
        // },
        // tasksFetchingSuccess(state, action: PayloadAction<ITask[]>) {
        //     state.isLoading = false;
        //     state.error = "";
        //     state.tasks = action.payload;
        // },
        // tasksFetchingError(state, action: PayloadAction<string>) {
        //     state.isLoading = false;
        //     state.error = action.payload;
        // },
    },
    extraReducers: {
        // [fetchTasks.fulfilled.type]: (state, action: PayloadAction<ITask[]>) => {
        //     state.isLoading = false;
        //     state.error = "";
        //     state.tasks = action.payload;
        // },
        // [fetchTasks.rejected.type]: (state, action: PayloadAction<string>) => {
        //     state.isLoading = false;
        //     state.error = action.payload;
        // },
        // [fetchTasks.pending.type]: (state) => {
        //     state.isLoading = true;
        // },
    }
});

export default tasksSlice.reducer;
