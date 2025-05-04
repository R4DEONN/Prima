import {BaseReporter} from "./BaseReporter";

class ConsoleReporter extends BaseReporter
{
	_additionalReport(line: number, pos: number, message: string)
	{
		console.error(`Error at line ${line} and pos ${pos}: ${message}`);
	}
}

export {ConsoleReporter};