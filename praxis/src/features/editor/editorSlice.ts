import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

interface EditorState
{
	theme: 'vs' | 'vs-dark' | 'hc-black' | 'prima-dark' | 'prima-dark-2';
	language: string;
	code: string;
}

const initialState: EditorState = {
	theme: 'prima-dark',
	language: 'prima',
	code: '// Начните писать код...',
};

export const editorSlice = createSlice({
	name: 'editor',
	initialState,
	reducers: {
		setTheme: (state, action: PayloadAction<EditorState['theme']>) =>
		{
			state.theme = action.payload;
		},
		setLanguage: (state, action: PayloadAction<string>) =>
		{
			state.language = action.payload;
		},
		updateCode: (state, action: PayloadAction<string>) =>
		{
			state.code = action.payload;
		},
	},
});

//Экспортируем actions (А точнее action creator'ы)
export const {setTheme, setLanguage, updateCode} = editorSlice.actions;
//Экспортируем сам редьсер
export default editorSlice.reducer;