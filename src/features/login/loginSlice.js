import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const apiURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://merelaager.ee";

export const loginUser = createAsyncThunk("login/loginUser", async (credentials) => {
  const response = await fetch(`${apiURL}/api/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials)});
  return response.json();
});

const loginSlice = createSlice({
  name: "login",
  initialState: { status: "idle" },
  extraReducers: {
    [loginUser.fulfilled]: (state, action) => {
      state.status = "ok";
      state.token = action.payload.accessToken;
    },
    [loginUser.rejected]: (state, action) => {
      state.status = "forbidden";
      state.error = action.error.message;
    },
  },
});

export const getLogin = (state) => state.login.data;

export default loginSlice.reducer;
