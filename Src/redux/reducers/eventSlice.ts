import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface EventState {
  eventShares: string[];
  like: number;
}

const initialState: EventState = {
  eventShares: [],
  like: 0,
};

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setLikeEvent: (state, action: PayloadAction<number>) => {
      state.like += action.payload;
    },
    addEvent: (state, action: PayloadAction<EventState>) => {
      console.log(action.payload.eventShares, 1234);

      state.eventShares = action.payload.eventShares;
    },
    removeEvent: state => {
      state.eventShares = [];
    },
    resetEvents: () => initialState, // Reset toàn bộ danh sách event
  },
});

export const eventReducer = eventSlice.reducer;
export const {addEvent, removeEvent, resetEvents, setLikeEvent} =
  eventSlice.actions;
export const eventSelector = (state: any) => state.events;
