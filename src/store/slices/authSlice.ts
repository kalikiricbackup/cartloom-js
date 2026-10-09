import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  isAuthenticated: Boolean(localStorage.getItem("accessToken")),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signedIn(state) {
      state.isAuthenticated = true;
    },
    signedOut(state) {
      state.isAuthenticated = false;
    },
  },
});

export const { signedIn, signedOut } = authSlice.actions;
export default authSlice.reducer;
