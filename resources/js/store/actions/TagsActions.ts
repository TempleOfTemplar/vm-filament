import {createAsyncThunk} from "@reduxjs/toolkit";
import api from "../../utils/Api";
import {Task} from "../../Models/Task";

export const fetchTags = createAsyncThunk(
    'tags/fetchAll',
    async (_, thunkAPI) => {
        try {
            const response = await api().get<{ data: Task[] }>("tags");
            return response.data.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }

    }
)
