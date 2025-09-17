import { createSlice } from "@reduxjs/toolkit";

const storedAuth = JSON.parse(localStorage.getItem("auth")) || {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: storedAuth,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload; // You can pass {username, role, etc.}
      localStorage.setItem("auth", JSON.stringify(state));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("auth");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
