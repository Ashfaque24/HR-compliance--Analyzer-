

// Redux Toolkit imports for creating slices and async thunks
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/**
 * Async thunk for user login API call.
 * Sends credentials to backend.
 * If successful, returns response data with token and user info.
 * If failed, returns error message.
 */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:4000/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();

      // API call failed, reject thunk with error message
      if (!response.ok) {
        return rejectWithValue(data.error || "Login failed");
      }
      // API call successful, return data
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

/**
 * Async thunk for user logout API call.
 * Sends logout request to backend.
 * If successful, returns confirmation data.
 * If failed, rejects thunk with error message.
 */
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:4000/admin/logout", {
        method: "POST",
        credentials: "include",  // include cookies if any for logout
      });
      const data = await response.json();

      // API returned error status
      if (!response.ok) {
        return rejectWithValue(data.error || "Logout failed");
      }
      // Successful logout confirmation
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// --- PERSIST TOKEN ON REFRESH ---
// Read token from localStorage when Redux state initializes
const persistedToken = localStorage.getItem('token');
// You can also persist admin using localStorage if you wish to retain it too
// const persistedAdmin = JSON.parse(localStorage.getItem("admin") || "null");

// Initial state for the auth slice of Redux store. Now includes persisted token.
const initialState = {
  isAuthenticated: !!persistedToken,
  loading: false,
  error: null,
  token: persistedToken || null,
  admin: null, // Or: persistedAdmin if you want admin data on refresh too
};

/**
 * Redux slice for authentication state management.
 * Handles user login/logout and token management with async thunk lifecycle actions.
 */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Reducer to reset error state to null
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Pending state of login API call
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Fulfilled state on successful login
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;   // Store returned token
        state.admin = action.payload.admin;   // Store admin user info

        // Persist token for session continuity on reload
        localStorage.setItem("token", action.payload.token);
        // Optionally persist admin info as well:
        // localStorage.setItem("admin", JSON.stringify(action.payload.admin));
      })
      // Rejected state on login failure
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login error";
        state.isAuthenticated = false;
        state.token = null;
        state.admin = null;
      })
      // Pending state of logout API call
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Fulfilled state on successful logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;        // Clear stored token
        state.admin = null;        // Clear admin info
        state.error = null;

        // Remove persistent token from localStorage on logout
        localStorage.removeItem("token");
        // localStorage.removeItem("admin"); // Optionally clear persisted admin
      })
      // Rejected state on logout failure
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Logout error";
      });
  },
});

// Export resetError action to clear error messages
export const { resetError } = authSlice.actions;

// Export the reducer to be combined in Redux store
export default authSlice.reducer;
