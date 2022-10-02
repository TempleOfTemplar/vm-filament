import {AppDispatch} from "../store";
import {tasksSlice} from "../reducers/TasksSlice";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {Task} from "../../Models/Task";
import api from "../../utils/Api";

// export const fetchTasks = () => async (dispatch: AppDispatch) => {
//     try {
//         dispatch(tasksSlice.actions.tasksFetching());
//         const response = await http.get<ITask[]>("tasks");
//         dispatch(tasksSlice.actions.tasksFetchingSuccess(response.data));
//     } catch (error: any) {
//         dispatch(tasksSlice.actions.tasksFetchingError(error.message));
//     }
// }

export const fetchTasks = createAsyncThunk(
    'tasks/fetchAll',
    async (_, thunkAPI) => {
        try {
            const response = await api().get<{ data: Task[] }>("tasks");
            return response.data.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }

    }
)
