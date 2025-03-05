import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  socket: null,
  incomingCall: null,
};
const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setIncomingCall: (state, action) => {
      state.incomingCall = action.payload;
    },
  },
});
export const socketReducer = socketSlice.reducer;
export const {setSocket, setIncomingCall} = socketSlice.actions;
export const socketSelector = (state: any) => state.socket;
