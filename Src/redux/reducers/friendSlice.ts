import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {set} from 'lodash';

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
    resetFriend: state => {
      state.friends = [];
      state.friendRequests = [];
      state.removeFriends = [];
      state.block = [];
    },
    setBlock: (state, action: PayloadAction<string[]>) => {
      state.block = action.payload; // ✅ Chỉ cập nhật block, không ảnh hưởng dữ liệu khác
    },
    addOneFriend: (state, action: PayloadAction<string | string[]>) => {
      // Thêm friend nếu chưa có
      if (Array.isArray(action.payload)) {
        state.friends = action.payload;
      } else {
        if (!state.friends.includes(action.payload)) {
          state.friends.push(action.payload);
        }
      }
    },
    removeFriend: (state, action: PayloadAction<string>) => {
      state.friends = state.friends.filter(id => id !== action.payload);
    },
  },
});
export const friendReducer = friendSlice.reducer;
export const {addFriend, resetFriend, setBlock, addOneFriend, removeFriend} =
  friendSlice.actions;
export const friendSelector = (state: any) => state.friends;
