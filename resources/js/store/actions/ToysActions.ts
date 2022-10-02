import {createAsyncThunk} from "@reduxjs/toolkit";
import api from "../../utils/Api";
import {Task} from "../../Models/Task";

export const fetchToys = createAsyncThunk(
    'toys/fetchAll',
    async (_, thunkAPI) => {
        try {
            const response = await api().get<{ data: Task[] }>("toys");
            return response.data.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }

    }
)
