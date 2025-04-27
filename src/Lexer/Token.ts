import {TokenType, tokenTypeToRegexMap} from "./TokenType";

class Token
{
	private readonly _type: TokenType;
	private _data: string;
	private readonly _row: number;
	private readonly _pos: number;

	// Static list of separators (equivalent to your SEPARATORS vector)
	public static readonly SEPARATORS: string[] = [
		'(', ')', '[', ']', '{', '}', ';', ','
	];

	constructor(type: TokenType, data: string, row: number, pos: number)
	{
		this._type = type;
		this._data = data;
		this._row = row;
		this._pos = pos;
	}

	public getType(): TokenType
	{
		return this._type;
	}

	public getData(): string
	{
		return this._data;
	}

	public setData(data: string): void
	{
		this._data = data;
	}

	public getRow(): number
	{
		return this._row;
	}

	public getPos(): number
	{
		return this._pos;
	}
}

export {Token, TokenType, tokenTypeToRegexMap};