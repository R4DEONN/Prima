import Editor from '@monaco-editor/react';
import {useAppSelector, useAppDispatch} from '../../app/hooks.ts';
import {updateCode} from '../../features/editor/editorSlice.ts';
import {editorOptions, registerPrimaLanguage} from "./monacoConfig.ts";
import {a} from "vite/dist/node/moduleRunnerTransport.d-DJ_mE5sf";

export function CodeEditor()
{
	const {theme, language, code} = useAppSelector((state) => state.editor);
	const dispatch = useAppDispatch();

	const logTokens = (editor: any) =>
	{
		const model = editor.getModel();
		const tokens = monaco.editor.tokenize(model.getValue(), 'prima');
		console.log('Monaco Tokens:', tokens);

		model.onDidChangeContent(() =>
		{
			const updatedTokens = monaco.editor.tokenize(model.getValue(), 'prima');
			console.log('Updated Tokens:', updatedTokens);
		});
	}

	const handleEditorDidMount = (editor: any, monaco: any) =>
	{
		registerPrimaLanguage(monaco);

		//logTokens(editor);
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