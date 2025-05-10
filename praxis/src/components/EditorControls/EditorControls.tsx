import {useAppSelector} from '../../app/hooks.ts';
import {setTheme, setLanguage} from '../../features/editor/editorSlice.ts';
import {Dropdown} from "../Dropdown/Dropdown.tsx";
import {ThemeToggle} from "../ThemeToggle/ThemeToggle.tsx";

export function EditorControls()
{
	const {theme, language} = useAppSelector((state) => state.editor);

	const themeOptions = [
		{value: 'vs', label: 'Light'},
		{value: 'vs-dark', label: 'Dark'},
		{value: 'hc-black', label: 'High Contrast'},
		{value: 'prima-dark', label: 'Prima Dark'},
		{value: 'prima-dark-2', label: 'Prima Dark 2'},
		{value: 'prima-dark-3', label: 'Prima Dark 3'},
	];

	const languageOptions = [
		{value: 'javascript', label: 'JavaScript'},
		{value: 'typescript', label: 'TypeScript'},
		{value: 'prima', label: 'Prima'},
	];

	return (
		<div style={{display: 'flex', gap: '1%', marginBottom: '1%', alignItems: 'center', boxSizing: 'border-box', height: '10%'}}>
			<h1 style={{marginRight: '66%'}}>Praxis</h1>

			<Dropdown
				options={themeOptions}
				selectedValue={theme}
				actionCreator={setTheme as (payload: string) => any}
			/>
			<Dropdown
				options={languageOptions}
				selectedValue={language}
				actionCreator={setLanguage as (payload: string) => any}
			/>
			<ThemeToggle>
			</ThemeToggle>
		</div>
	);
}