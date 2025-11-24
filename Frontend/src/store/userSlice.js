import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  role: "",
  name: "",
  email: "",
  auth: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { _id, role, name, email, auth } = action.payload;

      state._id = _id;
      state.role = role;
      state.name = name;
      state.email = email;
      state.auth = auth;
    },
    resetUser: (state) => {
      state._id = "";
      state.role = "";
      state.name = "";
      state.email = "";
      state.auth = false;
    },
  },
});

export const { setUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
