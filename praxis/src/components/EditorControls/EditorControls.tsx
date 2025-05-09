import {useAppSelector, useAppDispatch} from '../../app/hooks.ts';
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
	];

	const languageOptions = [
		{value: 'javascript', label: 'JavaScript'},
		{value: 'typescript', label: 'TypeScript'},
		{value: 'prima', label: 'Prima'},
	];

	return (
		<div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
			<h1 style={{marginRight: '60%'}}>Praxis</h1>

			<Dropdown
				options={themeOptions}
				selectedValue={theme}
				actionCreator={setTheme}
			/>
			<Dropdown
				options={languageOptions}
				selectedValue={language}
				actionCreator={setLanguage}
			/>
			<ThemeToggle>
			</ThemeToggle>
		</div>
	);
}