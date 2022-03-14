import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setToken } from "../../components/Common/requestAPI";

const apiURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://merelaager.ee";

export const loginUser = createAsyncThunk(
  "login/loginUser",
  async (credentials, { rejectWithValue }) => {
    let response;

    try {
      response = await fetch(`${apiURL}/api/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
    } catch {
      return rejectWithValue(500);
    }

    return response.ok ? response.json() : rejectWithValue(response.status);
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState: { status: "idle", token: null, ok: false },
  extraReducers: {
    [loginUser.fulfilled]: (state, action) => {
      const { accessToken } = action.payload;
      state.status = "ok";
      state.token = accessToken;
      setToken(accessToken);
    },
    [loginUser.rejected]: (state, action) => {
      state.status = "forbidden";
      state.errorCode = action.payload;
    },
  },
});

export const getToken = (state) => state.login.token;

export default loginSlice.reducer;
