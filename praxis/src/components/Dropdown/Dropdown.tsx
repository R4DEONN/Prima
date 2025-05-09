import React, {useRef, useEffect, useState} from 'react';
import {useAppDispatch} from '../../app/hooks';
import styles from './Dropdown.module.css';

interface DropdownProps
{
	options: { value: string; label: string }[];
	selectedValue: string;
	actionCreator: (payload: string) => any;
	className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
													  options,
													  selectedValue,
													  actionCreator,
													  className = '',
												  }) =>
{
	const dispatch = useAppDispatch();
	const selectRef = useRef<HTMLSelectElement>(null);
	const [minWidth, setMinWidth] = useState(0);

	// Рассчитываем минимальную ширину по самому длинному элементу
	useEffect(() =>
	{
		if (selectRef.current)
		{
			const tempSelect = document.createElement('select');
			tempSelect.style.position = 'absolute';
			tempSelect.style.visibility = 'hidden';

			options.forEach(option =>
			{
				const tempOption = document.createElement('option');
				tempOption.textContent = option.label;
				tempSelect.appendChild(tempOption);
			});

			document.body.appendChild(tempSelect);
			const width = tempSelect.scrollWidth;
			document.body.removeChild(tempSelect);

			setMinWidth(width);
		}
	}, [options]);

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
	{
		dispatch(actionCreator(e.target.value));
	};

	return (
		<select
			ref={selectRef}
			value={selectedValue}
			onChange={handleChange}
			className={`${styles.dropdown} ${className}`}
			style={{minWidth: `${minWidth}px`}}
		>
			{options.map((option) => (
				<option key={option.value} value={option.value}>
					{option.label}
				</option>
			))}
		</select>
	);
};