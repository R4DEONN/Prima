import {CodeEditor} from './components/CodeEditor/CodeEditor.tsx';
import {EditorControls} from './components/EditorControls/EditorControls.tsx';

function App()
{
	return (
		<div style={{marginLeft: '2%', height: '100vh', width: '98vw'}}>
			<EditorControls/>
			<div style={{display: 'flex', flexDirection: 'row', width: '100%', height: '100%'}}>
				<CodeEditor/>
			</div>
		</div>
	);
}

export default App;