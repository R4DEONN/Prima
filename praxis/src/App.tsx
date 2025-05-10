import {CodeEditor} from './components/CodeEditor/CodeEditor.tsx';
import {EditorControls} from './components/EditorControls/EditorControls.tsx';
import {CommandInput} from "./components/CommandInput/CommandInput.tsx";
import {CommandOutput} from "./components/CommandOutput/CommandOutput.tsx";

function App()
{
	return (
		<div style={{paddingLeft: '20px', height: '100vh', width: '100vw'}}>
			<EditorControls/>
			<div style={{display: 'flex', flexDirection: 'row', width: '100%', height: '100%'}}>
				<CodeEditor/>
				<div style={{paddingLeft: '20px', display: 'flex', flexDirection: 'column', width: '30%', height: '100%'}}>
					<CommandInput/>
					<CommandOutput/>
				</div>
			</div>
		</div>
	);
}

export default App;