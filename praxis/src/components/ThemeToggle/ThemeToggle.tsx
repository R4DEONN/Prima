import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {toggleTheme} from '../../features/theme/themeSlice.ts';
import styles from './ThemeToggle.module.css';

export const ThemeToggle = () =>
{
	const theme = useAppSelector((state) => state.appTheme);
	const dispatch = useAppDispatch();

	return (
		<button
			className={styles.toggle}
			onClick={() => dispatch(toggleTheme())}
			aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
		>
			{theme === 'light' ? '🌙' : '☀️'}
		</button>
	)
}