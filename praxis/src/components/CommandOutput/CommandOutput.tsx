import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCommandHistory, clearHistory, selectIsRunning } from '../../features/command/commandSlice';
import styles from './CommandOutput.module.css';

export const CommandOutput = () => {
	const commandHistory = useAppSelector(selectCommandHistory);
	const isRunning = useAppSelector(selectIsRunning);
	const dispatch = useAppDispatch();

	const getStatusClass = (status: string) => {
		switch(status) {
			case 'success': return styles.success;
			case 'error': return styles.error;
			case 'pending': return styles.pending;
			default: return '';
		}
	};

	return (
		<div className={styles.container}>
			<h3 className={styles.title}>Результаты выполнения:</h3>
			<ul className={styles.list}>
				{commandHistory.map((command, index) => (
					<li key={index} className={`${styles.item} ${getStatusClass(command.status)}`}>
						<span className={styles.prompt}>{command.status === 'pending' ? '▶' : '✓'}</span>
						<span className={styles.command}>{command.input}</span>
						<pre className={styles.result}>
              {command.output}
            </pre>
					</li>
				))}
			</ul>

			{isRunning && <div className={styles.runningIndicator}>Выполнение кода...</div>}

			{commandHistory.length > 0 && (
				<button
					onClick={() => dispatch(clearHistory())}
					className={styles.clearButton}
					disabled={isRunning}
				>
					Очистить историю
				</button>
			)}
		</div>
	);
};