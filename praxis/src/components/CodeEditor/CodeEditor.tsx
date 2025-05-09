import Editor from '@monaco-editor/react';
import {useAppSelector, useAppDispatch} from '../../app/hooks.ts';
import {updateCode} from '../../features/editor/editorSlice.ts';
import {editorOptions, registerPrimaLanguage} from "./monacoConfig.ts";

export function CodeEditor()
{
	const {theme, language, code} = useAppSelector((state) => state.editor);
	const dispatch = useAppDispatch();

	const handleEditorDidMount = (editor: any, monaco: any) =>
	{
		registerPrimaLanguage(monaco);
	};

	return (
		<Editor
			height="80vh"
			width="70%"
			language={language}
			theme={theme}
			value={code}
			onChange={(value) => dispatch(updateCode(value || ''))}
			onMount={handleEditorDidMount}
			options={editorOptions}
		/>
	);
}