import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

interface EditorState
{
	theme: 'vs' | 'vs-dark' | 'hc-black';
	language: string;
	code: string;
}

const initialState: EditorState = {
	theme: 'vs-dark',
	language: 'javascript',
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

export const {setTheme, setLanguage, updateCode} = editorSlice.actions;
export default editorSlice.reducer;