import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  makeGetRequest,
  makePostRequest,
} from "../../components/Common/requestAPI";

export const fetchInfo = createAsyncThunk("userAuth/fetchInfo", async () => {
  const response = await makeGetRequest("/me");
  return response.json();
});

export const updateCurrentShift = createAsyncThunk(
  "userAuth/updateCurrentShift",
  async (newShiftNr) => {
    const response = await makePostRequest(`/me/currentShift/${newShiftNr}`);
    if (!response.ok) return 0;
    return newShiftNr;
  }
);

const userAuthSlice = createSlice({
  name: "userInfo",
  initialState: {
    userInfo: { useRoot: false },
    status: "idle",
    error: null,
  },
  reducers: {
    setRootUsage: (state, action) => {
      state.userInfo.useRoot = action.payload;
    },
  },
  extraReducers: {
    [fetchInfo.fulfilled]: (state, action) => {
      console.log(action.payload);
      state.status = "succeeded";
      state.userInfo = action.payload;
      state.userInfo.useRoot = false;
    },
    [fetchInfo.rejected]: (state, action) => {
      state.status = "failed";
      state.userInfo = action.error.message;
    },
    [updateCurrentShift.fulfilled]: (state, action) => {
      if (action.payload) state.userInfo.currentShift = action.payload;
    },
  },
});

export const selectUserInfo = (state) => state.userInfo.userInfo;
export const selectRootUsage = (state) => state.userInfo.userInfo.useRoot;
export const selectCurrentShift = (state) =>
  state.userInfo.userInfo.currentShift;
export const selectUserShifts = (state) => state.userInfo.userInfo.shiftRoles;

export const selectCurrentRole = (state) => {
  const { currentShift } = state.userInfo.userInfo;
  const { shifts } = state.userInfo.userInfo;
  const data = shifts.find((el) => el.id === currentShift);
  return data ? data.role : "full";
};

export const selectRole = (state, shiftNr) => {
  const { shiftRoles } = state.userInfo.userInfo;
  return shiftRoles[shiftNr];
};

export const selectRootStatus = (state) => state.userInfo.userInfo.isRoot;

export const { setRootUsage } = userAuthSlice.actions;

export default userAuthSlice.reducer;
