import {Provider} from 'react-redux';
import store from './app/store';
import {CodeEditor} from './components/CodeEditor';
import {Controls} from './components/Controls';

function App()
{
	return (
		<Provider store={store}>
			<div style={{
				paddingLeft: '20px',
				width: '100vw', // 100% ширины viewport
				boxSizing: 'border-box', // учитываем padding в ширине
				overflowX: 'auto' // горизонтальная прокрутка при необходимости
			}}>
				<h1>Redux Code Editor</h1>
				<Controls/>
				<CodeEditor/>
			</div>
		</Provider>
	);
}

export default App;