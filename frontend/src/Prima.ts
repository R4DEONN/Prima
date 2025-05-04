import {Scanner} from "./Scanner/Scanner";
import * as fs from "node:fs";
import * as readline from "node:readline";

class Prima {
	private _scanner: Scanner;

	constructor(sourcePath: string) {
		const source = fs.readFileSync(sourcePath, 'utf8');
		this._scanner = new Scanner(source);
	}

	run(source: string) {
		this._scanner = new Scanner(source);

	}

	runFile(sourcePath: string) {
		const source = fs.readFileSync(sourcePath, 'utf8');
		this.run(source);
	}

	/**
	 * Запуск в режиме консольного интерпретатора
	 */
	async runPrompt() {
		const readline = require('readline').createInterface({
			input: process.stdin,
			output: process.stdout
		});

		for (;;)
		{
			const line = await new Promise<string>(resolve => {
				readline.question('> ', resolve);
			});

			if (line === null)
			{
				break;
			}

			this.run(line);
		}

		readline.close();
	}
}

export {Prima};