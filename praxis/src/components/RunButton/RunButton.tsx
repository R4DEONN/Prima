import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { executeCommand } from '../../features/command/commandSlice';
import styles from './RunButton.module.css';

interface RunButtonProps {
	code?: string;  // Делаем необязательным
	language?: string;  // Делаем необязательным
}

export const RunButton: React.FC<RunButtonProps> = ({
														code = '',  // Значение по умолчанию
														language = 'javascript'  // Значение по умолчанию
													}) => {
	const dispatch = useAppDispatch();
	// Альтернативно: получаем код из хранилища Redux
	const editorCode = useAppSelector((state) => state.editor.code);

	const handleRun = () => {
		// Используем код из пропсов или из хранилища
		const codeToRun = code || editorCode || '';

		if (!codeToRun.trim()) {
			dispatch(executeCommand(JSON.stringify({
				input: 'Ошибка выполнения',
				output: 'Не указан код для выполнения',
				status: 'error'
			})));
			return;
		}

		if (window.electronAPI) {
			window.electronAPI.invoke('execute-code', {
				language,
				code: codeToRun,
				mode: 'source'
			}).then((result: { success: boolean; output: string }) => {
				dispatch(executeCommand(JSON.stringify({
					input: `Выполнение ${language} кода`,
					output: result.output,
					status: result.success ? 'success' : 'error'
				})));
			}).catch((error) => {
				dispatch(executeCommand(JSON.stringify({
					input: 'Ошибка выполнения',
					output: error.message,
					status: 'error'
				})));
			});
		} else {
			dispatch(executeCommand(JSON.stringify({
				input: `Запуск ${language} кода (тестовый режим)`,
				output: 'Веб-режим: код не выполняется\n' + codeToRun,
				status: 'success'
			})));
		}
	};

	return (
		<button
			onClick={handleRun}
			className={styles.button}
			disabled={!code && !editorCode}  // Отключаем если нет кода
		>
			Запустить
		</button>
	);
};