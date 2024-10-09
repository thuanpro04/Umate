import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./reducers/authReducer";

const store= configureStore({
    reducer:{
        authReducer
    }, 
     middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false, // Tắt kiểm tra tính tuần tự
        }),
    
})
export default store