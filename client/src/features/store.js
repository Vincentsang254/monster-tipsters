/** @format */

import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./slices/usersSlice";
import tipsReducer from "./slices/tipsSlice";
import jackpotsReducer from "./slices/jackpotSlice";
import authReducer from "./slices/authSlice";
import imagesReducer from "./slices/imagesSlice";
import paymentsReducer from "./slices/paymentSlice";

 const store = configureStore({
	reducer: {
		users: usersReducer,
		tips: tipsReducer,
		jackpots: jackpotsReducer,
		auth: authReducer,
		images: imagesReducer,
		payments: paymentsReducer,
	},
});
 export default store