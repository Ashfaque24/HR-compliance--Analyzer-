import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import requestWrapper from "../../api/axiosInstance";

// Async thunk for user login with new backend URL and response handling
// export const loginUser = createAsyncThunk(
//   "auth/loginUser",
//   async (credentials, { rejectWithValue }) => {
//     try {
//       const response = await fetch("http://localhost:3000/admin/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(credentials),
//       });
//       const data = await response.json();

//       if (!response.ok) {
//         return rejectWithValue(data.message || "Login failed");
//       }

//       return data; // data = { token }
//     } catch (error) {
//       return rejectWithValue(error.message || "Network error");
//     }
//   }
// );

export const loginUser = createAsyncThunk("auth/loginUser", async (postData) => {
  const res = await requestWrapper({
   method : "POST",
   url:"admin/auth/login",
   data:postData
  });
  console.log("second",res);
  
  return res
});

const persistedToken = localStorage.getItem("token");

const initialState = {
  isAuthenticated: !!persistedToken,
  loading: false,
  error: null,
  admin: null, // No admin info returned by backend login
  token: persistedToken || null, // Add token so state tracks it
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.admin = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.admin = null; // no admin info provided by backend

        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login error";
        state.isAuthenticated = false;
        state.token = null;
        state.admin = null;
      });
  },
});

export const { resetError, logout } = authSlice.actions;

export default authSlice.reducer;
