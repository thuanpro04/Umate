import {eventReducer} from './reducers/eventSlice';
import {friendReducer} from './reducers/friendSlice';
import {profileReducer} from './reducers/profileSlice';
import {themeReducer} from './reducers/themeSlice';
import {configureStore} from '@reduxjs/toolkit';
import {authReducer} from './reducers/authReducer';
import {socketReducer} from './reducers/socketSlice';
import {languageReducer} from './reducers/languageSlice';
import {MessThemeReducer} from './reducers/messThemeSlice';

const store = configureStore({
  reducer: {
    authReducer,
    theme: themeReducer, // 🌟 'theme' sẽ là key trong state toàn cục
    profileReducer,
    friends: friendReducer,
    events: eventReducer,
    socket: socketReducer,
    language: languageReducer,
    messTheme: MessThemeReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, // Tắt kiểm tra tính tuần tự
      immutableCheck: false, // Tắt kiểm tra bất biến
    }),
});
export default store;
