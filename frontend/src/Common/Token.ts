import {TokenType} from "./TokenType";

class Token
{
	constructor(
		private readonly _type: TokenType,
		private readonly _lexeme: string,
		private readonly _line: number,
		private readonly _pos: number,
	)
	{
	}

	public getType(): TokenType
	{
		return this._type;
	}

	public getLexeme(): string
	{
		return this._lexeme;
	}

	public getLine(): number
	{
		return this._line;
	}

	public getPos(): number
	{
		return this._pos;
	}

	public toString(): string
	{
		return `At line ${this._line} and pos ${this._pos}: ${this._type} (${this._lexeme})`;
	}
}

export {Token};