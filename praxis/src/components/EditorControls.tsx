import {useAppSelector, useAppDispatch} from '../app/hooks';
import {setTheme, setLanguage} from '../features/editor/editorSlice';

export function EditorControls()
{
	const {theme, language} = useAppSelector((state) => state.editor);
	const dispatch = useAppDispatch();

	return (
		<div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
			{/* Выбор темы */}
			<select
				value={theme}
				onChange={(e) => dispatch(setTheme(e.target.value as any))}
			>
				<option value="vs">Light</option>
				<option value="vs-dark">Dark</option>
				<option value="hc-black">High Contrast</option>
			</select>

			{/* Выбор языка */}
			<select
				value={language}
				onChange={(e) => dispatch(setLanguage(e.target.value))}
			>
				<option value="javascript">JavaScript</option>
				<option value="typescript">TypeScript</option>
				<option value="prima">Prima</option>
			</select>
		</div>
	);
}