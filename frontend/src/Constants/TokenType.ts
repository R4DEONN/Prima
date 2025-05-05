enum TokenType
{
	// Single-character tokens.
	LEFT_PAREN = "LEFT_PAREN",
	RIGHT_PAREN = "RIGHT_PAREN",
	LEFT_BRACE = "LEFT_BRACE",
	RIGHT_BRACE = "RIGHT_BRACE",
	COMMA = "COMMA",
	DOT = "DOT",
	MINUS = "MINUS",
	PLUS = "PLUS",
	SEMICOLON = "SEMICOLON",
	SLASH = "SLASH",
	PERCENT = "PERCENT",
	COLON = "COLON",

	// One or two character tokens.
	BANG = "BANG",
	BANG_EQUAL = "BANG_EQUAL",
	EQUAL = "EQUAL",
	EQUAL_EQUAL = "EQUAL_EQUAL",
	GREATER = "GREATER",
	GREATER_EQUAL = "GREATER_EQUAL",
	LESS = "LESS",
	LESS_EQUAL = "LESS_EQUAL",
	STAR = "STAR",
	STAR_STAR = "STAR_STAR",

	// Literals.
	IDENTIFIER = "IDENTIFIER",
	STRING = "STRING",
	NUMBER = "NUMBER",

	// Keywords.
	AND = "AND",
	CLASS = "CLASS",
	ELSE = "ELSE",
	FALSE = "FALSE",
	FUNCTION = "FUNCTION",
	FOR = "FOR",
	IF = "IF",
	NULL = "NULL",
	OR = "OR",
	PRINT = "PRINT",
	RETURN = "RETURN",
	SUPER = "SUPER",
	THIS = "THIS",
	TRUE = "TRUE",
	VAR = "VAR",
	CONST = "CONST",

	EOF = "EOF"
}

export {TokenType};