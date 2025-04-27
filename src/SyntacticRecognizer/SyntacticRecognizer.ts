import {TableRow} from "../Common/Table";
import {Token} from "../Lexer/Token";

class SyntacticRecognizer {
	private currentState: number = 1;
	private currentTokenIndex: number = 0;
	private stack: number[] = [];

	constructor(
		private table: Map<number, TableRow>,
		private tokens: Token[]
	) {
	}

	public parse(): boolean {
		while (this.currentState > 0 && this.currentTokenIndex < this.tokens.length)
		{
			this.printTrace(`Processing state: ${this.currentState}`);

			if (!this.processState(this.currentState))
			{
				return false;
			}

			if (this.isEnd(this.currentState))
			{
				this.printTrace("End of parsing reached.");
				return true;
			}
		}

		this.printTrace("Error: Unexpected end of parsing");
		return false;
	}

	private processState(currentState: number): boolean {
		if (this.isStateNotFound(currentState))
		{
			this.printTrace(`Error: Invalid state ${currentState}`);
			return false;
		}

		const row = this.table.get(currentState)!;
		const currentToken = this.tokens[this.currentTokenIndex];
		this.printTrace(`Current state: ${row.number}, Non-terminal: ${row.nonTerminal} Token: ${currentToken.getData()}`);

		if (this.currentTokenIndex >= this.tokens.length)
		{
			this.printTrace("Error: Unexpected end of input");
			return false;
		}

		const currentSymbol = currentToken.getData();
		const isSymbolValid = this.isCurrentStateInSymbols(row, currentSymbol);

		if (row.isError && !isSymbolValid)
		{
			this.printTrace(`Error: Unexpected symbol '${currentSymbol}' at position ${currentToken.getPos()}\n Expected: ${row.guidingSymbols.join(' ')}`);
			return false;
		}

		if (isSymbolValid)
		{
			if (row.isShift && !this.handleShift())
			{
				return false;
			}

			this.handlePointerAndStack(row, currentState);
		}
		else
		{
			this.currentState = currentState + 1;
		}

		return true;
	}

	private handleShift(): boolean {
		if (this.currentTokenIndex >= this.tokens.length)
		{
			this.printTrace("Error: Unexpected end of input");
			return false;
		}

		const currentSymbol = this.tokens[this.currentTokenIndex].getData();
		this.printTrace(`Shift: ${currentSymbol}`);
		this.currentTokenIndex++;
		return true;
	}

	private handlePointerAndStack(row: TableRow, currentState: number): void {
		if (row.pointer > 0)
		{
			this.currentState = row.pointer;
		}
		else if (row.pointer === -1)
		{
			if (this.stack.length > 0)
			{
				this.currentState = this.stack.pop()!;
			}
		}

		if (row.isStack)
		{
			this.stack.push(currentState + 1);
		}
	}

	private printTrace(message: string): void {
		console.log(message);
	}

	private isStateNotFound(currentState: number): boolean {
		return !this.table.has(currentState);
	}

	private isCurrentStateInSymbols(row: TableRow, currentSymbol: string): boolean {
		return row.guidingSymbols.includes(currentSymbol);
	}

	private isEnd(currentState: number): boolean {
		return this.table.get(currentState)!.isEnd;
	}
}

export {SyntacticRecognizer};