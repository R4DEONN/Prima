import Editor from '@monaco-editor/react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { updateCode } from '../features/code/codeSlice';

export function CodeEditor() {
	const code = useAppSelector((state) => state.code.currentCode);
	const dispatch = useAppDispatch();

	return (
		<Editor
			height="80vh"
			defaultLanguage="typescript"
			value={code}
			onChange={(value) => dispatch(updateCode(value || ''))}
			theme="vs-dark"
			options={{
				minimap: { enabled: false },
				fontSize: 14,
			}}
		/>
	);
}