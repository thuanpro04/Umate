import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LanguageState {
  value: 'vi' | 'en';
}
const initialState: LanguageState = {
  value: 'vi',
};
const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    toggleLanguage: state => {
      state.value = state.value === 'vi' ? 'en' : 'vi';
    },
    setLanguage:(state,action:PayloadAction<'vi'|'en'>) =>{
        state.value=action.payload
    }
  },
});
export const languageReducer= languageSlice.reducer;
export const {toggleLanguage,setLanguage}=languageSlice.actions
export const languageSelecter =(state:any) =>state.language.value
