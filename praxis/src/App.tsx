import {CodeEditor} from './components/CodeEditor/CodeEditor.tsx';
import {EditorControls} from './components/EditorControls/EditorControls.tsx';

function App()
{
	return (
		<div style={{paddingLeft: '20px', height: '100vh', width: '100vw'}}>
			<EditorControls/>
			<CodeEditor/>
		</div>
	);
}

export default App;