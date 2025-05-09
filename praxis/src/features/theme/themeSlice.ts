import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from '@reduxjs/toolkit';

type Theme = 'light' | 'dark';

const getInitialTheme = (): Theme =>
{
	const savedTheme = localStorage.getItem('theme');
	if (savedTheme)
	{
		return savedTheme as Theme;
	}

	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const initialState: Theme = getInitialTheme();

export const themeSlice = createSlice({
	name: 'theme',
	initialState,
	reducers: {
		setTheme: (_, action: PayloadAction<Theme>) =>
		{
			localStorage.setItem('theme', action.payload)
			return action.payload
		},
		toggleTheme: (state) =>
		{
			const newTheme = state === 'light' ? 'dark' : 'light';
			localStorage.setItem('theme', newTheme);
			return newTheme;
		},
	}
});


export const {setTheme, toggleTheme} = themeSlice.actions;
export default themeSlice.reducer;