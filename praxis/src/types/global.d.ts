import { ElectronAPI } from './electronAPI';

declare global {
	interface Window {
		electronAPI: ElectronAPI;
		process?: {
			versions?: {
				electron?: string;
			};
		};
	}
}