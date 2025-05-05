import {IErrorReporter} from "./IErrorReporter";

abstract class BaseReporter implements IErrorReporter
{
	private _hadError: boolean = false;

	public hadError(): boolean
	{
		return this._hadError;
	}

	public setError(error: boolean)
	{
		this._hadError = error;
	}

	public report(line: number, pos: number, message: string): void
	{
		this._hadError = true;
		this._additionalReport(line, pos, message);
	}

	protected _additionalReport(line: number, pos: number, message: string): void
	{}
}

export {BaseReporter};