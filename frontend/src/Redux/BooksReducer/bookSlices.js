import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FormModesEnum, asyncStatuses } from "../enums";
import axios from "axios";

export const fetchAllRecords = createAsyncThunk("list", async ({ apiUrl, searchParams = {} }, thunkAPI) => {
    // console.log({ apiUrl, searchParams })
    try {
        if (apiUrl?.slice?.(-1) !== "/") {
            apiUrl += "/";
        }
        const response = await axios.get(apiUrl, { params: searchParams });
        const data = response.data;

        return data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err?.response?.data);
    }
});

export const fetchARecord = createAsyncThunk("fetch", async ({ apiUrl, id }) => {
    // console.log({ apiUrl, id });
    const response = await axios.get(apiUrl + `/${id}/`);
    const data = response.data;
    return data;
});

export const deleteARecord = createAsyncThunk("delete", async ({ apiUrl, id }) => {
    // console.log({ apiUrl, id });
    const response = await axios.delete(`${apiUrl}/delete/?id=${id}`);
    const data = response.data;
    return data;
});

export const addARecord = createAsyncThunk("add", async ({ apiUrl, data }) => {
    // console.log({ apiUrl, data });
    const response = await axios.post(apiUrl + "/", data);
    const responseData = response.data;
    return responseData;
});

export const editARecord = createAsyncThunk("edit", async ({ apiUrl, id, data }) => {
    console.log({ apiUrl, id, data });
    const response = await axios.patch(apiUrl + `/${id}/`, data);
    const responseData = response.data;
    return responseData;
});

const initialState = {
    data: [],
    count: 0,
    fetchRequestStatus: null,
    fetchRequestErrorMessage: null,
    deleteRecordStatus: null,
    addRecordStatus: null,
    fetchRecordStatus: null,
    currentEditViewFormId: null,
    currentFormMode: FormModesEnum.NONE,
    currentRecordData: {},
    editRecordStatus: null,
}

const masterSlice = createSlice({
    name: "master",
    initialState: initialState,
    reducers: {
        resetDeleteRecordStatus(state) {
            state.deleteRecordStatus = null;
        },
        resetFetchRequestStatus(state) {
            state.fetchRequestStatus = null;
            state.fetchRequestErrorMessage = null;
        },
        resetAddRecordStatus(state) {
            state.addRecordStatus = null;
        },
        resetEditRecordStatus(state) {
            state.editRecordStatus = null;
        },
        resetFetchRecordStatus(state) {
            state.fetchRecordStatus = null;
        },
        setFormModeAsEdit(state, action) {
            state.currentEditViewFormId = action.payload.id;
            state.currentFormMode = FormModesEnum.EDIT;
        },
        setFormModeAsAdd(state) {
            state.currentEditViewFormId = null;
            state.currentFormMode = FormModesEnum.ADD;
        },
        setFormModeAsView(state, action) {
            state.currentEditViewFormId = action.payload.id;
            state.currentFormMode = FormModesEnum.VIEW;
        },
        resetFormModeToNone(state) {
            state.currentEditViewFormId = null;
            state.currentFormMode = FormModesEnum.NONE;
            state.currentRecordData = {};
            state.fetchRecordStatus = null;
        }
    },
    extraReducers: (builder) => {
        // fetch all records
        builder.addCase(fetchAllRecords.pending, (state) => {
            state.fetchRequestStatus = asyncStatuses.LOADING;
        });
        builder.addCase(fetchAllRecords.fulfilled, (state, action) => {
            state.fetchRequestStatus = asyncStatuses.SUCCESS;
            let data = action.payload.results;
            if (Array.isArray(data)) {
                data = data.map((d, i) => {
                    d.key = i;
                    return d;
                })
            }
            // console.log({ data })
            state.data = data;
            state.count = action.payload.count;
        });
        builder.addCase(fetchAllRecords.rejected, (state, action) => {
            state.fetchRequestStatus = asyncStatuses.FAILED;
            state.data = [];
            state.count = 0;
            state.fetchRequestErrorMessage = action?.payload?.message;
        });

        // delete a record
        builder.addCase(deleteARecord.pending, (state) => {
            state.deleteRecordStatus = asyncStatuses.LOADING;
        });
        builder.addCase(deleteARecord.fulfilled, (state) => {
            state.deleteRecordStatus = asyncStatuses.SUCCESS;
        });
        builder.addCase(deleteARecord.rejected, (state) => {
            // // console.log("Delete a record failed");
            state.deleteRecordStatus = asyncStatuses.FAILED;
        });

        // add a record
        builder.addCase(addARecord.pending, (state) => {
            state.addRecordStatus = asyncStatuses.LOADING;
        });
        builder.addCase(addARecord.fulfilled, (state) => {
            state.addRecordStatus = asyncStatuses.SUCCESS;
        });
        builder.addCase(addARecord.rejected, (state) => {
            state.addRecordStatus = asyncStatuses.FAILED;
        });

        // fetch a record
        builder.addCase(fetchARecord.pending, (state) => {
            state.fetchRecordStatus = asyncStatuses.LOADING;
            state.currentRecordData = {};
        });
        builder.addCase(fetchARecord.fulfilled, (state, action) => {
            state.fetchRecordStatus = asyncStatuses.SUCCESS;
            // console.log(action)
            state.currentRecordData = action.payload;
        });
        builder.addCase(fetchARecord.rejected, (state) => {
            state.fetchRecordStatus = asyncStatuses.FAILED;
            state.currentRecordData = {};
        });

        // edit a record
        builder.addCase(editARecord.pending, (state) => {
            state.editRecordStatus = asyncStatuses.LOADING;
        });
        builder.addCase(editARecord.fulfilled, (state) => {
            state.editRecordStatus = asyncStatuses.SUCCESS;
        });
        builder.addCase(editARecord.rejected, (state) => {
            state.editRecordStatus = asyncStatuses.FAILED;
        });
    }
});

export const {
    resetDeleteRecordStatus,
    resetFetchRequestStatus,
    resetFetchRecordStatus,
    resetAddRecordStatus,
    resetEditRecordStatus,
    setFormModeAsAdd,
    setFormModeAsEdit,
    setFormModeAsView,
    resetFormModeToNone
} = masterSlice.actions;

export default masterSlice.reducer;