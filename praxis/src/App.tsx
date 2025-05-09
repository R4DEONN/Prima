import {Provider} from 'react-redux';
import {store} from './app/store';
import {CodeEditor} from './components/CodeEditor';
import {EditorControls} from './components/EditorControls';

function App()
{
	return (
		<Provider store={store}>
			<div style={{paddingLeft: '20px', height: '100vh', width: '100vw'}}>
				<h1 style={{margin: '0px', paddingBottom: '2vh'}}>Praxis</h1>
				<EditorControls/>
				<CodeEditor/>
			</div>
		</Provider>
	);
}

export default App;