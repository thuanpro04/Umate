import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  socket: null,
  incomingCall: null,
};
const socketSlice = createSlice({
  name: 'socket',
  initialState: {
    socketData: initialState,
  },
  reducers: {
    setSocket: (state, action) => {
      state.socketData.socket = action.payload;
    },
    setIncomingCall: (state, action) => {
      state.socketData.incomingCall = action.payload;
    },
  },
});
export const socketReducer = socketSlice.reducer;
export const {setSocket, setIncomingCall} = socketSlice.actions;
export const socketSelector = (state: any) => state.socketReducer.socketData;
