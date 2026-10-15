import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  displayName: string;
}

const initialState: AuthState = {
  isAuthenticated: Boolean(localStorage.getItem("accessToken")),
  displayName: localStorage.getItem("userName") ?? "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signedIn(state, action: PayloadAction<string>) {
      state.isAuthenticated = true;
      state.displayName = action.payload;
    },
    signedOut(state) {
      state.isAuthenticated = false;
      state.displayName = "";
    },
  },
});

export const { signedIn, signedOut } = authSlice.actions;
export default authSlice.reducer;
