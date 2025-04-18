import {createSlice, PayloadAction} from '@reduxjs/toolkit';

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
  myLove: string[];
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
  myLove: [],
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
    setMylove: (state, action: PayloadAction<string>) => {
      if (!state.profileData.myLove) {
        state.profileData.myLove = [];
      }
      
      // Bỏ optional chaining (?) vì chúng ta đã đảm bảo myLove tồn tại
      if (!state.profileData.myLove.includes(action.payload)) {
        state.profileData.myLove = [
          ...state.profileData.myLove,  
          action.payload,
        ];
      } else {
        state.profileData.myLove = state.profileData.myLove.filter(
          item => item !== action.payload,
        );
      }
    },
  },
});
export const profileReducer = profileSlice.reducer;
export const {addProfile, removeProfile, setMylove} = profileSlice.actions;
export const profileSelector = (state: any) => state.profileReducer.profileData;




