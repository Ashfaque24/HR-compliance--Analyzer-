

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


// Initial state for the auth slice of Redux store.
// Tracks if user is authenticated, loading state, errors, and auth token and user info.
const initialState = {
  isAuthenticated: false,
  loading: false,
  error: null,
  token: null,
  admin: null,
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

        // Optionally persist token for session continuity on reload
        localStorage.setItem('token', action.payload.token);
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
        localStorage.removeItem('token');
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
