import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface CodeState {
	currentCode: string;
	history: string[];
}

const initialState: CodeState = {
	currentCode: '// Начните писать код...\nconsole.log("Hello, world!");',
	history: [],
};

const codeSlice = createSlice({
	name: 'code',
	initialState,
	reducers: {
		updateCode: (state, action: PayloadAction<string>) => {
			state.currentCode = action.payload;
			state.history.push(action.payload);
		},
		resetCode: (state) => {
			state.currentCode = initialState.currentCode;
		},
	},
});

export const { updateCode, resetCode } = codeSlice.actions;
export default codeSlice.reducer;