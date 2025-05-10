import React, {useState} from 'react';
import {useAppDispatch} from '../../app/hooks';
import {executeCommand} from '../../features/command/commandSlice';
import styles from './CommandInput.module.css';

export const CommandInput = () =>
{
	const [inputValue, setInputValue] = useState('');
	const dispatch = useAppDispatch();

	const handleSubmit = (e: React.FormEvent) =>
	{
		e.preventDefault();
		if (inputValue.trim())
		{
			dispatch(executeCommand(inputValue));
			setInputValue('');
		}
	};

	return (
		<div className={styles.container}>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					placeholder="Введите команду..."
					className={styles.field}
				/>
				<button type="submit" className={styles.button}>
					Выполнить
				</button>
			</form>
		</div>
	);
};