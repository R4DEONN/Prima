import {TokenType} from "./TokenType";

export const KEYWORDS: Record<string, TokenType> = {
	class: TokenType.CLASS,
	else: TokenType.ELSE,
	false: TokenType.FALSE,
	for: TokenType.FOR,
	function: TokenType.FUNCTION,
	if: TokenType.IF,
	null: TokenType.NULL,
	print: TokenType.PRINT,
	return: TokenType.RETURN,
	super: TokenType.SUPER,
	this: TokenType.THIS,
	true: TokenType.TRUE,
	var: TokenType.VAR,
	const: TokenType.CONST,
};