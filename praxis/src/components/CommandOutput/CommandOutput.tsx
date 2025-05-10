import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCommandHistory, clearHistory } from '../../features/command/commandSlice';
import styles from './CommandOutput.module.css';

export const CommandOutput = () => {
	const commandHistory = useAppSelector(selectCommandHistory);
	const dispatch = useAppDispatch();

	return (
		<div className={styles.container}>
			<h3 className={styles.title}>История команд:</h3>
			<ul className={styles.list}>
				{commandHistory.map((command, index) => (
					<li key={index} className={styles.item}>
						<span className={styles.prompt}>$</span>
						<span className={styles.command}>{command.input}</span>
						{command.output && (
							<div className={styles.result}>
								{command.output}
							</div>
						)}
					</li>
				))}
			</ul>
			{commandHistory.length > 0 && (
				<button
					onClick={() => dispatch(clearHistory())}
					className={styles.clearButton}
				>
					Очистить историю
				</button>
			)}
		</div>
	);
};