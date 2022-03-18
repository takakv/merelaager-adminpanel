import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  requestTokenRefresh,
  setToken,
} from "../../components/Common/requestAPI";

const apiURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://merelaager.ee";

export const refreshToken = createAsyncThunk(
  "appAuth/refreshToken",
  async (_, { rejectWithValue }) => {
    const response = await requestTokenRefresh();

    // Null error code won't trigger error responses.
    return response || rejectWithValue(0);
  }
);

export const loginUser = createAsyncThunk(
  "appAuth/loginUser",
  async (credentials, { rejectWithValue }) => {
    let response;

    try {
      response = await fetch(`${apiURL}/api/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include",
      });
    } catch {
      return rejectWithValue(500);
    }

    return response.ok ? response.json() : rejectWithValue(response.status);
  }
);

const appAuthSlice = createSlice({
  name: "appAuth",
  initialState: {
    status: "idle",
    token: null,
    error: null,
  },
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
    [refreshToken.fulfilled]: (state, action) => {
      const accessToken = action.payload;
      state.status = "ok";
      state.token = accessToken;
      setToken(accessToken);
    },
    [refreshToken.rejected]: (state, action) => {
      state.status = "forbidden";
      state.errorCode = action.payload;
      setToken(null);
    },
  },
});

export default appAuthSlice.reducer;
