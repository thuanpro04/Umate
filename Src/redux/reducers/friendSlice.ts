import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface friendState {
  friends: string[];
  friendRequests: string[];
  removeFriends: string[];
  block: string[];
}
const initialState: friendState = {
  friends: [],
  friendRequests: [],
  removeFriends: [],
  block: [],
};
const friendSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    addFriend: (state, action: PayloadAction<friendState>) => {
      state.friends = action.payload.friends;
      state.friendRequests = action.payload.friendRequests;
      state.removeFriends = action.payload.removeFriends;
      state.block = action.payload.block;
    },
    removeFriend: state => {
      state.friends = [];
      state.friendRequests = [];
      state.removeFriends = [];
      state.block = [];
    },
    setBlock: (state, action: PayloadAction<string[]>) => {
      state.block = action.payload; // ✅ Chỉ cập nhật block, không ảnh hưởng dữ liệu khác
    },
    setFriend: (state, action: PayloadAction<string[]>) => {
      state.friends = [...state.friends, ...action.payload];
    },
  },
});
export const friendReducer = friendSlice.reducer;
export const {addFriend, removeFriend, setBlock, setFriend} =
  friendSlice.actions;
export const friendSelector = (state: any) => state.friends;
