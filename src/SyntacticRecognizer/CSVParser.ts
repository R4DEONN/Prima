import {TableRow} from "../Common/Table";

class CSVParser {
	private table: Map<number, TableRow>;

	constructor(csvFilePath: string) {
		this.table = new Map<number, TableRow>();
		this.parseCSV(csvFilePath);
	}

	private parseCSV(csvFilePath: string): void {
		const fs = require('fs');
		const lines = fs.readFileSync(csvFilePath, 'utf-8').split('\n');

		for (const line of lines)
		{
			if (line.trim() === '')
			{
				continue;
			}

			const tokens = line.split(';');
			if (tokens.length < 8)
			{
				throw new Error(`Invalid CSV format in line: ${line}`);
			}

			const row: TableRow = {
				number: parseInt(tokens[0].trim()),
				nonTerminal: tokens[1].trim(),
				guidingSymbols: tokens[2].trim().split(' ').filter(s => s !== ''),
				isShift: parseInt(tokens[3].trim()) !== 0,
				isError: parseInt(tokens[4].trim()) !== 0,
				pointer: this.parsePointer(tokens[5].trim()),
				isStack: parseInt(tokens[6].trim()) !== 0,
				isEnd: parseInt(tokens[7].trim()) !== 0
			};

			this.table.set(row.number, row);
		}
	}

	private parsePointer(token: string): number {
		if (token === "NULL")
		{
			return -1;
		}
		return parseInt(token);
	}

	public getTable(): Map<number, TableRow> {
		return new Map(this.table); // Return a copy to prevent external modifications
	}
}

export {CSVParser};