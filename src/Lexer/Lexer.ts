import {Token, TokenType, tokenTypeToRegexMap} from "./Token";
import { TokenUtils } from "./TokenUtils";

enum LexerState {
	DEFAULT,
	STRING,
	COMMENT,
	BLOCK_COMMENT
}

class Lexer {
	private tokenList: Token[] = [];
	private state: LexerState = LexerState.DEFAULT;
	private currentTokenIndex: number = 0;

	public scanInput(input: string): void {
		const lines = input.split('\n');
		let row = 0;
		let actualRow = 0;
		let pos = 1;
		let lexem = '';

		for (const line of lines)
		{
			actualRow++;

			if (this.state === LexerState.COMMENT)
			{
				this.pushToken(lexem, row, pos);
				this.state = LexerState.DEFAULT;
				pos = 1;
			}

			if (this.state !== LexerState.DEFAULT)
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
					this.state === LexerState.DEFAULT)
				{
					this.pushToken(lexem, row, pos);
					pos = i + 1;
				}

				if (this.state === LexerState.BLOCK_COMMENT && char === '/' && i !== 0 && line[i - 1] === '*')
				{
					lexem += char;
					this.pushToken(lexem, row, pos);
					this.state = LexerState.DEFAULT;
					row = actualRow;
					continue;
				}

				if (this.state === LexerState.DEFAULT && char === '/')
				{
					if (i + 1 < line.length)
					{
						if (line[i + 1] === '/')
						{
							this.pushToken(lexem, row, pos);
							this.state = LexerState.COMMENT;
							pos = i + 1;
							lexem = '//';
							i += 1;
							continue;
						}
						else if (line[i + 1] === '*')
						{
							this.pushToken(lexem, row, pos);
							this.state = LexerState.BLOCK_COMMENT;
							pos = i + 1;
							lexem = '/*';
							i += 1;
							continue;
						}
					}
				}

				if (TokenUtils.isOperation(char) &&
					(lexem === '' || !TokenUtils.isOperation(lexem[lexem.length - 1])) &&
					this.state === LexerState.DEFAULT)
				{
					if (i === 0 || (line[i - 1] !== 'e' && line[i - 1] !== 'E'))
					{
						this.pushToken(lexem, row, pos);
					}
				}

				if (TokenUtils.isSeparator(char) && this.state === LexerState.DEFAULT)
				{
					this.pushToken(lexem, row, pos);

					pos = i + 1;
					if (!this.isWhitespace(char))
					{
						lexem = char;
						this.pushToken(lexem, row, pos);
					}
					lexem = '';
					continue;
				}

				if (TokenUtils.isQuote(char))
				{
					if (i === 0 || line[i - 1] !== '\\')
					{
						if (this.state === LexerState.DEFAULT)
						{
							this.state = LexerState.STRING;
							this.pushToken(lexem, row, pos);
							lexem = char;
							pos = i + 1;
							continue;
						}
						else if (this.state === LexerState.STRING)
						{
							this.state = LexerState.DEFAULT;
							lexem += char;
							this.pushToken(lexem, row, pos);
							continue;
						}
					}
				}

				lexem += char;
			}

			if (lexem !== '' && this.state === LexerState.DEFAULT)
			{
				this.pushToken(lexem, row, pos);
				pos = 1;
			}
		}

		const end = 'end';
		this.pushToken(end, row, pos);
	}

	public getTokenList(): Token[] {
		return this.tokenList;
	}

	private pushToken(lexem: string, row: number, pos: number): void {
		if (lexem !== '')
		{
			if (lexem === 'end')
			{
				this.tokenList.push(new Token(TokenType.END, lexem, row, pos));
			}
			else
			{
				const token = TokenUtils.createToken(lexem, row, pos);
				this.tokenList.push(token);
				lexem = '';
			}
		}
	}

	private isWhitespace(char: string): boolean {
		return char === ' ' || char === '\t';
	}
}

export {Lexer, LexerState};