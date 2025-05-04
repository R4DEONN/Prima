import {IErrorReporter} from "./IErrorReporter";

abstract class BaseReporter implements IErrorReporter
{
	private _hadError: boolean = false;

	hadError(): boolean
	{
		return this._hadError;
	}

	setError(error: boolean)
	{
		this._hadError = error;
	}

	report(line: number, pos: number, message: string): void
	{
		this._hadError = true;
		this._additionalReport(line, pos, message);
	}

	protected _additionalReport(line: number, pos: number, message: string): void
	{}
}

export {BaseReporter};