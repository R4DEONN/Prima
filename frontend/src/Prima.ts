import {Scanner} from "./Scanner/Scanner";
import * as fs from "node:fs";
import * as readline from "node:readline";
import {ConsoleReporter} from "./Error/ErrorReporter/ConsoleReporter";
import {IErrorReporter} from "./Error/ErrorReporter/IErrorReporter";

class Prima
{
	private static _errorReporter: IErrorReporter = new ConsoleReporter();

	public static run(source: string): void
	{
		const scanner = new Scanner(source, this._errorReporter);
		const tokens = scanner.scanTokens();
		if (this._errorReporter.hadError())
		{
			process.exit(1);
		}

		tokens.forEach(token => console.log(token));
	}

	public static runFile(sourcePath: string): void
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
	public static async runPrompt(): Promise<void>
	{
		const readlineInterface = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
			prompt: '> ',
		});

		readlineInterface
			.on('line', line => {
				this.run(line);
				this._errorReporter.setError(false);
				readlineInterface.prompt();
			})
			.on('close', () => {
				process.exit(0);
			})
	}
}

export {Prima};