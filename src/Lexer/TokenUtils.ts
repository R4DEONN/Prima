import {Token, TokenType, tokenTypeToRegexMap} from "./Token";

const MAX_SAFE_INTEGER = 9007199254740992.0;

export function createToken(data: string, row: number, pos: number): Token
{
	for (const pattern of tokenTypeToRegexMap)
	{
		const match = data.match(pattern.regex);
		if (match && match[0] === data)
		{
			if (pattern.type === TokenType.NUMBER)
			{
				try
				{
					const number = parseFloat(data);
					if (number > MAX_SAFE_INTEGER)
					{
						throw new Error("Number exceeds MAX_SAFE_INTEGER");
					}
				} catch (e)
				{
					return new Token(TokenType.ERROR, data, row, pos);
				}
			}
			else if (pattern.type === TokenType.IDENTIFIER && data.length > 20)
			{
				return new Token(TokenType.ERROR, data, row, pos);
			}
			return new Token(pattern.type, match[0], row, pos);
		}
	}

	return new Token(TokenType.ERROR, data, row, pos);
}

export function isSeparator(ch: string): boolean
{
	return isWhitespace(ch) || Token.SEPARATORS.includes(ch);
}

export function isOperation(ch: string): boolean
{
	return ['+', '-', '*', '=', '/', '!', '<', '>'].includes(ch);
}

export function isQuote(ch: string): boolean
{
	return ch === '"';
}

function isWhitespace(ch: string): boolean
{
	return /\s/.test(ch);
}

export const TokenUtils = {
	createToken,
	isSeparator,
	isOperation,
	isQuote
};