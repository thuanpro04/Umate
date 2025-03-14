import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface MessThemeState {
  conversationId: string;
  themeId: string;
}
const initialState: MessThemeState = {
  conversationId: '',
  themeId: 'light',
};
const messThemeSlice = createSlice({
  name: 'messTheme',
  initialState,
  reducers: {
    setConversationId: (state, action: PayloadAction<string>) => {
      state.conversationId = action.payload;
    },
    setThemeId: (state, action: PayloadAction<string>) => {
      state.themeId = action.payload;
    },
    resetTheme: state => {
      state.themeId = 'light';
    },
  },
});
export const MessThemeReducer = messThemeSlice.reducer;
export const {setConversationId, resetTheme, setThemeId} =
  messThemeSlice.actions;
export const messThemeSelecter = (state: any) => state.messTheme.value;
