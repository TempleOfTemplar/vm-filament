import {createAsyncThunk} from "@reduxjs/toolkit";
import api from "../../utils/Api";
import {Task} from "../../Models/Task";

export const fetchCategories = createAsyncThunk(
    'categories/fetchAll',
    async (_, thunkAPI) => {
        try {
            const response = await api().get<{ data: Task[] }>("categories");
            return response.data.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }

    }
)
