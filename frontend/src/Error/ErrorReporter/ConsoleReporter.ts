import {BaseReporter} from "./BaseReporter";

class ConsoleReporter extends BaseReporter
{
	protected _additionalReport(line: number, pos: number, message: string): void
	{
		console.error(`Error at line ${line} and pos ${pos}: ${message}`);
	}
}

export {ConsoleReporter};