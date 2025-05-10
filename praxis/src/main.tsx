import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.tsx'
import { store } from './app/store'
import { ThemeProvider } from './components/ThemeProvider/ThemeProvider'
import { BrowserRouter } from 'react-router-dom'

const RootComponent = () => (
	<BrowserRouter>
		<ThemeProvider>
			<App />
		</ThemeProvider>
	</BrowserRouter>
)

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Provider store={store}>
			<RootComponent />
		</Provider>
	</StrictMode>
)