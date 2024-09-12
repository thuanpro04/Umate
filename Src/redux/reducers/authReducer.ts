import {createSlice} from '@reduxjs/toolkit';

interface authState {
  id: string;
  email: string;
  accesstoken: string;
}
const initialState: authState = {
  id: '',
  email: '',
  accesstoken: '',
};
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authData: initialState,
  },
  reducers: {
    addAuth: (state, action) => {
      state.authData = action.payload;
    },
    removeAuth: (state, action) => {
      state.authData = initialState;
    },
  },
});
export const authReducer = authSlice.reducer;
export const {addAuth, removeAuth} = authSlice.actions;
export const authSelector = (state: any) => state.authReducer.authData;