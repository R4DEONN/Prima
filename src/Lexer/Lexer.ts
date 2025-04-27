import {Token, TokenType, tokenTypeToRegexMap} from "./Token";
import {TokenUtils} from "./TokenUtils";

enum LexerState
{
	DEFAULT,
	STRING,
	COMMENT,
	BLOCK_COMMENT
}

class Lexer
{
	private _tokenList: Token[] = [];
	private _state: LexerState = LexerState.DEFAULT;

	public scanInput(input: string): void
	{
		const lines = input.split('\n');
		let row = 0;
		let actualRow = 0;
		let pos = 1;
		let lexem = '';

		for (const line of lines)
		{
			actualRow++;

			if (this._state === LexerState.COMMENT)
			{
				this._pushToken(lexem, row, pos);
				this._state = LexerState.DEFAULT;
				pos = 1;
			}

			if (this._state !== LexerState.DEFAULT)
			{
				lexem += '\n';
			}
			else
			{
				row = actualRow;
			}

			for (let i = 0; i < line.length; i++)
			{
				const char = line[i];

				if (lexem === '')
				{
					pos = i + 1;
				}
				else if (TokenUtils.isOperation(lexem[lexem.length - 1]) &&
					(lexem.length < 2 || (lexem[lexem.length - 2] !== 'e' && lexem[lexem.length - 2] !== 'E')) &&
					!TokenUtils.isOperation(char) &&
					this._state === LexerState.DEFAULT)
				{
					this._pushToken(lexem, row, pos);
					pos = i + 1;
				}

				if (this._state === LexerState.BLOCK_COMMENT && char === '/' && i !== 0 && line[i - 1] === '*')
				{
					lexem += char;
					this._pushToken(lexem, row, pos);
					this._state = LexerState.DEFAULT;
					row = actualRow;
					continue;
				}

				if (this._state === LexerState.DEFAULT && char === '/')
				{
					if (i + 1 < line.length)
					{
						if (line[i + 1] === '/')
						{
							this._pushToken(lexem, row, pos);
							this._state = LexerState.COMMENT;
							pos = i + 1;
							lexem = '//';
							i += 1;
							continue;
						}
						else if (line[i + 1] === '*')
						{
							this._pushToken(lexem, row, pos);
							this._state = LexerState.BLOCK_COMMENT;
							pos = i + 1;
							lexem = '/*';
							i += 1;
							continue;
						}
					}
				}

				if (TokenUtils.isOperation(char) &&
					(lexem === '' || !TokenUtils.isOperation(lexem[lexem.length - 1])) &&
					this._state === LexerState.DEFAULT)
				{
					if (i === 0 || (line[i - 1] !== 'e' && line[i - 1] !== 'E'))
					{
						this._pushToken(lexem, row, pos);
					}
				}

				if (TokenUtils.isSeparator(char) && this._state === LexerState.DEFAULT)
				{
					this._pushToken(lexem, row, pos);

					pos = i + 1;
					if (!this._isWhitespace(char))
					{
						lexem = char;
						this._pushToken(lexem, row, pos);
					}
					lexem = '';
					continue;
				}

				if (TokenUtils.isQuote(char))
				{
					if (i === 0 || line[i - 1] !== '\\')
					{
						if (this._state === LexerState.DEFAULT)
						{
							this._state = LexerState.STRING;
							this._pushToken(lexem, row, pos);
							lexem = char;
							pos = i + 1;
							continue;
						}
						else if (this._state === LexerState.STRING)
						{
							this._state = LexerState.DEFAULT;
							lexem += char;
							this._pushToken(lexem, row, pos);
							continue;
						}
					}
				}

				lexem += char;
			}

			if (lexem !== '' && this._state === LexerState.DEFAULT)
			{
				this._pushToken(lexem, row, pos);
				pos = 1;
			}
		}

		const end = 'end';
		this._pushToken(end, row, pos);
	}

	public getTokenList(): Token[]
	{
		return this._tokenList;
	}

	private _pushToken(lexem: string, row: number, pos: number): void
	{
		if (lexem !== '')
		{
			if (lexem === 'end')
			{
				this._tokenList.push(new Token(TokenType.END, lexem, row, pos));
			}
			else
			{
				const token = TokenUtils.createToken(lexem, row, pos);
				this._tokenList.push(token);
				lexem = '';
			}
		}
	}

	private _isWhitespace(char: string): boolean
	{
		return char === ' ' || char === '\t';
	}
}

export {Lexer, LexerState};