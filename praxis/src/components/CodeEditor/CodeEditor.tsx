import Editor from '@monaco-editor/react';
import {useAppSelector, useAppDispatch} from '../../app/hooks.ts';
import {updateCode} from '../../features/editor/editorSlice.ts';
import {editorOptions, registerPrimaLanguage} from "./monacoConfig.ts";
import {useEffect, useRef, useState} from "react";

export function CodeEditor()
{
	const {theme, language, code} = useAppSelector((state) => state.editor);
	const dispatch = useAppDispatch();
	const editorRef = useRef<any>(null);
	const [isMounted, setIsMounted] = useState(false);

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

	const handleEditorDidMount = (editor: any, monacoInstance: typeof monaco) =>
	{
		registerPrimaLanguage(monacoInstance);
		editorRef.current = editor;
		logTokens(editor);
		setIsMounted(true);
	};

	useEffect(() => {
		if (isMounted && editorRef.current) {
			monaco.editor.setTheme(theme);
		}
	}, [isMounted, theme]);

	return (
		<Editor
			height="90%"
			width="70%"
			language={language}
			theme={isMounted ? theme : 'vs'}
			value={code}
			onChange={(value) => dispatch(updateCode(value || ''))}
			onMount={handleEditorDidMount}
			options={editorOptions}
		/>
	);
}