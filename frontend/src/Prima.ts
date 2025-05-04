import {Scanner} from "./Scanner/Scanner";
import * as fs from "node:fs";
import * as readline from "node:readline";
import {ConsoleReporter} from "./Error/ErrorReporter/ConsoleReporter";
import {IErrorReporter} from "./Error/ErrorReporter/IErrorReporter";

class Prima
{
	private static _errorReporter: IErrorReporter = new ConsoleReporter();

	static run(source: string)
	{
		const scanner = new Scanner(source, this._errorReporter);
		const tokens = scanner.scanTokens();
		if (this._errorReporter.hadError())
		{
			process.exit(1);
		}

		tokens.forEach(token => console.log(token));
	}

	static runFile(sourcePath: string)
	{
		try
		{
			const source = fs.readFileSync(sourcePath, 'utf8');
			this.run(source);
		}
		catch (e)
		{
			this._errorReporter.report(1, 1, `Invalid path: ${sourcePath}`);
			process.exit(1);
		}
	}

	/**
	 * Запуск в режиме консольного интерпретатора
	 */
	static async runPrompt()
	{
		const readlineInterface = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});

		for (; ;)
		{
			const line = await new Promise<string>(resolve =>
			{
				readlineInterface.question('> ', resolve);
			});

			if (line === null)
			{
				break;
			}

			this.run(line);
			this._errorReporter.setError(false);
		}

		readlineInterface.close();
	}
}

export {Prima};