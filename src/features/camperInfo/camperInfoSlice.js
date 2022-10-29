import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  makeGetRequest,
  makePatchRequest,
} from "../../components/Common/requestAPI";

export const fetchCamperInfo = createAsyncThunk(
  "camperInfo/fetchCamperInfo",
  async (shiftNr) => {
    const response = await makeGetRequest(`/campers/${shiftNr}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.value;
  }
);

export const updateCamperInfo = createAsyncThunk(
  "camperInfo/updateCamperInfo",
  async (req) => {
    const response = await makePatchRequest(
      `/campers/camper/${req.id}`,
      req.data
    );
    if (!response.ok) return {};
    return req;
  }
);

const camperInfoSlice = createSlice({
  name: "camperInfo",
  initialState: {
    camperInfo: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: {
    [fetchCamperInfo.fulfilled]: (state, action) => {
      state.status = "ok";
      state.camperInfo = action.payload;
    },
    [fetchCamperInfo.rejected]: (state, action) => {
      state.status = "nok";
      state.error = action.error.message;
    },
    [updateCamperInfo.fulfilled]: (state, action) => {
      const { id, field, data } = action.payload;
      const camper = state.camperInfo.find((entry) => entry.childId === id);
      camper[field] = data[field];
    },
  },
});

export const selectShiftCampers = (state, shiftNr) =>
  state.camperInfo.camperInfo.filter((camper) => camper.shiftNr === shiftNr);

export default camperInfoSlice.reducer;

export const selectAllCampersInfo = (state) => state.camperInfo.camperInfo;
