import {createSlice} from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userInfo: {},
    },
    reducers: {
        setUserInfo: (state, action) => {
            state.userInfo = Object.assign({}, action.payload);
        },
    },
});

export default userSlice.reducer;

export const {setUserInfo} = userSlice.actions;
