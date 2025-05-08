interface IErrorReporter
{
	report(line: number, pos: number, message: string): void;
	hadError(): boolean;
	setError(error: boolean): void;
}

export {IErrorReporter};