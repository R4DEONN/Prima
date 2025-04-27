import {TokenType, tokenTypeToRegexMap} from "./TokenType";

class Token {
	private type: TokenType;
	private data: string;
	private row: number;
	private pos: number;

	// Static list of separators (equivalent to your SEPARATORS vector)
	public static readonly SEPARATORS: string[] = [
		'(', ')', '[', ']', '{', '}', ';', ','
	];

	constructor(type: TokenType, data: string, row: number, pos: number) {
		this.type = type;
		this.data = data;
		this.row = row;
		this.pos = pos;
	}

	public getType(): TokenType {
		return this.type;
	}

	public getData(): string {
		return this.data;
	}

	public setData(data: string): void {
		this.data = data;
	}

	public getRow(): number {
		return this.row;
	}

	public getPos(): number {
		return this.pos;
	}
}

export {Token, TokenType, tokenTypeToRegexMap};