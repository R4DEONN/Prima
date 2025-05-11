import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from "@reduxjs/toolkit";

interface Command
{
	input: string;
	output: string;
	timestamp: number;
	status: 'success' | 'error' | 'pending';
}

interface CommandState
{
	history: Command[];
	isRunning: boolean;
}

const initialState: CommandState = {
	history: [],
	isRunning: false,
};

export const commandSlice = createSlice({
	name: 'command',
	initialState,
	reducers: {
		executeCommand: (state, action: PayloadAction<string>) =>
		{
			try
			{
				const command = JSON.parse(action.payload);
				const newCommand: Command = {
					input: command.input || `Запуск ${command.language} кода`,
					output: command.output,
					timestamp: Date.now(),
					status: command.status || 'pending'
				};
				state.history.push(newCommand);
				state.isRunning = false;
			} catch (e)
			{
				state.history.push({
					input: 'Ошибка выполнения',
					output: e instanceof Error ? e.message : String(e),
					timestamp: Date.now(),
					status: 'error'
				});
			}
		},
		clearHistory: (state) =>
		{
			state.history = [];
		},
	},
});

export const {executeCommand, clearHistory} = commandSlice.actions;

export const selectCommandHistory = (state: { command: CommandState }) =>
	state.command.history;

export const selectIsRunning = (state: { command: CommandState }) =>
	state.command.isRunning;

export default commandSlice.reducer;