import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface EventState {
  eventShares: string[];
}

const initialState: EventState = {
  eventShares: [],
};

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<EventState>) => {
      state.eventShares = [...state.eventShares, ...action.payload.eventShares];
    },
    removeEvent: state => {
      state.eventShares = [];
    },
    resetEvents: () => initialState, // Reset toàn bộ danh sách event
  },
});

export const eventReducer = eventSlice.reducer;
export const {addEvent, removeEvent, resetEvents} = eventSlice.actions;
export const eventSelector = (state: any) => state.events;
