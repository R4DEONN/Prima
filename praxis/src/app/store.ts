import { configureStore } from '@reduxjs/toolkit';
import codeReducer from '../features/code/codeSlice';

const store = configureStore({
	reducer: {
		code: codeReducer,
	},
});

// Автоматическое определение типов
export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = AppStore['dispatch'];

export default store;