import {configureStore} from '@reduxjs/toolkit';
import editorReducer from '../features/editor/editorSlice';
import themeReducer from "../features/theme/themeSlice.ts";

export const store = configureStore({
	reducer: {
		editor: editorReducer,
		appTheme: themeReducer
	},
});

// Полная типизация хранилища
export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = AppStore['dispatch'];