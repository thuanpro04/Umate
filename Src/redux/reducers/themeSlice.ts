import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  value: 'light' | 'dark'; // ✅ Sửa 'dart' thành 'dark'
}

const initialState: ThemeState = {
  value: 'light',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
      // 🌟 Đổi theme từ light sang dark và ngược lại
    toggleTheme: (state) => {
      state.value = state.value === 'light' ? 'dark' : 'light'; // ✅ 'dark' đúng chính tả
    },
        // 🌟 Cập nhật theme theo giá trị nhận được
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.value = action.payload;
    },
  },
});

export const themeReducer = themeSlice.reducer;
export const { toggleTheme, setTheme } = themeSlice.actions;

// Selector này cho phép lấy giá trị theme từ store.
export const themeSelector = (state: any) => state.theme.value;
