import Editor from '@monaco-editor/react';
import {useAppSelector, useAppDispatch} from '../../app/hooks';
import {updateCode} from '../../features/editor/editorSlice';
import {editorOptions, registerPrimaLanguage} from "./monacoConfig";
import {useEffect, useRef, useState} from "react";
import * as monaco from 'monaco-editor';
import {RunButton} from '../RunButton/RunButton';
import {CommandOutput} from '../CommandOutput/CommandOutput';
import styles from './CodeEditor.module.css';

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
		<>
			<div className={styles.editorContainer}>
				<Editor
					height="93%"
					width="100%"
					language={language}
					theme={isMounted ? theme : 'vs'}
					value={code}
					onChange={(value) => dispatch(updateCode(value || ''))}
					onMount={handleEditorDidMount}
					options={editorOptions}
				/>
				<div className={styles.controls}>
					<RunButton/>
				</div>
			</div>
			<div className={styles.outputContainer}>
				<CommandOutput/>
			</div>
		</>);
}