import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { asyncStatuses } from "../enums";
import axios from "axios";

const initialState = {
    user: {},
    token: null,
    isAuthenticated: null,
    status: null,
    signupStatus: null,
    errorMessage: null,
}

export const loginUserAsync = createAsyncThunk("auth/login", async ({ email, password }) => {
    const response = await axios.post("/auth/login/", { email, password });
    return response.data
});

export const signupUserAsync = createAsyncThunk("auth/signup", async ({ email, password, role }, thunkAPI) => {
    try {
        const response = await axios.post("/auth/signup/", { email, password, role });
        return response.data
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
});

const authSlices = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        logoutUser(state) {
            state.user = {};
            state.token = null;
            state.isAuthenticated = null;
            state.status = null;
            state.signupStatus = null;
        },
        resetSignUpStatus(state) {
            state.signupStatus = null;
            state.errorMessage = null;
        }
    },
    extraReducers: builder => {
        builder.addCase(loginUserAsync.pending, (state) => {
            state.status = asyncStatuses.LOADING
        });
        builder.addCase(loginUserAsync.fulfilled, (state, action) => {
            state.status = asyncStatuses.SUCCESS;
            const data = action.payload;
            // console.log({ data });
            state.isAuthenticated = true;
            state.token = data.token;
            state.user = data.user;
        });
        builder.addCase(loginUserAsync.rejected, (state) => {
            state.status = asyncStatuses.FAILED;
            state.isAuthenticated = null;
            state.token = null;
            state.user = {};
        });

        builder.addCase(signupUserAsync.pending, (state) => {
            state.signupStatus = asyncStatuses.LOADING
        });
        builder.addCase(signupUserAsync.fulfilled, (state) => {
            state.signupStatus = asyncStatuses.SUCCESS;
        });
        builder.addCase(signupUserAsync.rejected, (state, action) => {
            state.signupStatus = asyncStatuses.FAILED;
            if (action?.payload?.message) {
                state.errorMessage = action.payload.message;
            }
        });
    }
});

export const { logoutUser, resetSignUpStatus } = authSlices.actions;
export default authSlices.reducer;