import React from 'react';
import { useAppDispatch } from '../../app/hooks';
import { executeCommand } from '../../features/command/commandSlice';
import styles from './RunButton.module.css';

interface RunButtonProps {
	code?: string;
	language?: string;
}

export const RunButton: React.FC<RunButtonProps> = ({ code = '', language = 'javascript' }) => {
	const dispatch = useAppDispatch();

	const handleRun = () => {
		if (!code.trim()) return;

		const command = {
			type: 'execute',
			language,
			code
		};

		dispatch(executeCommand(JSON.stringify(command)));
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