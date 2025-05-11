import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { executeCommand } from '../../features/command/commandSlice';
import styles from './RunButton.module.css';

interface ExecutionResult {
	success: boolean;
	output: string;
}

export const RunButton = () => {
	const dispatch = useAppDispatch();
	const { code, language } = useAppSelector((state) => state.editor);
	const [isElectronEnv, setIsElectronEnv] = useState(false);

	useEffect(() => {
		setIsElectronEnv(
			!!(window.electronAPI && window.process?.versions?.electron)
		);
	}, []);

	const handleRun = async () => {
		if (!code.trim()) {
			dispatch(executeCommand(JSON.stringify({
				input: 'Ошибка выполнения',
				output: 'Не указан код для выполнения',
				status: 'error'
			})));
			return;
		}

		if (isElectronEnv && window.electronAPI) {
			try {
				const result = await window.electronAPI.invoke<ExecutionResult>(
					'execute-code',
					{ language, code, mode: 'source' }
				);

				dispatch(executeCommand(JSON.stringify({
					input: `Выполнение ${language} кода`,
					output: result.output,
					status: result.success ? 'success' : 'error'
				})));
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
				dispatch(executeCommand(JSON.stringify({
					input: 'Ошибка выполнения',
					output: errorMessage,
					status: 'error'
				})));
			}
		} else {
			dispatch(executeCommand(JSON.stringify({
				input: `Запуск ${language} кода`,
				output: 'Работает в тестовом режиме (не в Electron среде)',
				status: 'info'
			})));
		}
	};

	return (
		<button
			onClick={handleRun}
			className={styles.button}
			disabled={!code.trim()}
		>
			Запустить
		</button>
	);
};