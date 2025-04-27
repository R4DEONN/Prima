interface TableRow {
	number: number;
	nonTerminal: string;
	guidingSymbols: string[];
	isShift: boolean;
	isError: boolean;
	pointer: number;
	isStack: boolean;
	isEnd: boolean;
}

type Table = TableRow[];

export { TableRow, Table };