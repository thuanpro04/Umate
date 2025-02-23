import {createSlice} from '@reduxjs/toolkit';

interface profileState {
  name: string;
  email: string;
  avatar: string;
  bio: string;
  sex: string;
  address: string;
  link: string;
  className: string;
  majoring: string;
  majorCategory: string;
}
const initialState: profileState = {
  name: '',
  email: '',
  avatar: '',
  bio: '',
  sex: '',
  address: '',
  link: '',
  className: '',
  majoring: '',
  majorCategory: '',
};
const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profileData: initialState,
  },
  reducers: {
    addProfile: (state, action) => {
      state.profileData = action.payload;
    },
    removeProfile: state => {
      state.profileData = initialState;
    },
  },
});
export const profileReducer = profileSlice.reducer;
export const {addProfile, removeProfile} = profileSlice.actions;
export const profileSelector = (state: any) => state.profileReducer.profileData;
