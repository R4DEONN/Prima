export interface ElectronAPI {
	invoke<T = any>(channel: string, data?: any): Promise<T>;
	send(channel: string, data?: any): void;
	on(channel: string, listener: (...args: any[]) => void): void;
}