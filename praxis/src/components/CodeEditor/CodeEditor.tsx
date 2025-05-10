import Editor from '@monaco-editor/react';
import {useAppSelector, useAppDispatch} from '../../app/hooks.ts';
import {updateCode} from '../../features/editor/editorSlice.ts';
import {editorOptions, registerPrimaLanguage} from "./monacoConfig.ts";
import {useEffect, useRef, useState} from "react";
import * as monaco from 'monaco-editor';

export function CodeEditor()
{
	const {theme, language, code} = useAppSelector((state) => state.editor);
	const dispatch = useAppDispatch();
	const editorRef = useRef<any>(null);
	const [isMounted, setIsMounted] = useState(false);

	const handleEditorDidMount = (editor: any, monacoInstance: typeof monaco) =>
	{
		registerPrimaLanguage(monacoInstance);
		editorRef.current = editor;
		editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () =>
		{
			editor.getAction('editor.action.formatDocument').run();
		});
		setIsMounted(true);
	};

	useEffect(() =>
	{
		if (isMounted && editorRef.current)
		{
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