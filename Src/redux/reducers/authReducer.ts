import {createSlice} from '@reduxjs/toolkit';

interface authState {
  userId: string;
  theme: string;
  accesstoken: string;
  online: boolean;
}
const initialState: authState = {
  userId: '',
  theme: '',
  accesstoken: '',
  online: false,
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
    removeAuth: state => {
      state.authData = initialState;
    },
  },
});
export const authReducer = authSlice.reducer;
export const {addAuth, removeAuth} = authSlice.actions;
export const authSelector = (state: any) => state.authReducer.authData;
