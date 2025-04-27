enum TokenType {
	NUMBER = "NUMBER",
	VARIABLE_DECLARATION = "VARIABLE_DECLARATION",
	IF_STATEMENT = "IF_STATEMENT",
	THEN = "THEN",
	ELSE_BLOCK = "ELSE_BLOCK",
	PLUS = "PLUS",
	MINUS = "MINUS",
	DIVISION = "DIVISION",
	MULTIPLICATION = "MULTIPLICATION",
	RETURN = "RETURN",
	FUNCTION = "FUNCTION",
	ASSIGNMENT = "ASSIGNMENT",
	LOGICAL = "LOGICAL",
	FOR_STATEMENT = "FOR_STATEMENT",
	IDENTIFIER = "IDENTIFIER",
	STRING = "STRING",
	COMMENT = "COMMENT",
	COMMENT_BLOCK = "COMMENT_BLOCK",
	BRACKET = "BRACKET",
	CURLY_BRACKET = "CURLY_BRACKET",
	SQUARE_BRACKET = "SQUARE_BRACKET",
	SEPARATOR = "SEPARATOR",
	OR = "OR",
	AND = "AND",
	MOD = "MOD",
	DIV = "DIV",
	NOT = "NOT",
	ERROR = "ERROR",
	END = "END"
}

type TokenPattern = {
	type: TokenType;
	regex: RegExp;
};

const tokenTypeToRegexMap: TokenPattern[] = [
	{ type: TokenType.STRING, regex: /^"([^"\\]*(\\.[^"\\]*)*)"/ },
	{ type: TokenType.COMMENT, regex: /^\/\/.*/ },
	{ type: TokenType.COMMENT_BLOCK, regex: /^\/\*[\s\S]*?\*\// },
	{ type: TokenType.LOGICAL, regex: /^(===|==|!==|!=|<=|>=|<|>)/ },
	{ type: TokenType.NUMBER, regex: /^-?(\d+(\.\d*)?|\.\d+)([eE][-+]?\d+)?/ },
	{ type: TokenType.VARIABLE_DECLARATION, regex: /^(var|let|const)\b/ },
	{ type: TokenType.IF_STATEMENT, regex: /^if\b/ },
	{ type: TokenType.THEN, regex: /^then\b/ },
	{ type: TokenType.ELSE_BLOCK, regex: /^else\b/ },
	{ type: TokenType.OR, regex: /^([Oo][Rr])\b/ },
	{ type: TokenType.AND, regex: /^([Aa][Nn][Dd])\b/ },
	{ type: TokenType.MOD, regex: /^([Mm][Oo][Dd])\b/ },
	{ type: TokenType.DIV, regex: /^([Dd][Ii][Vv])\b/ },
	{ type: TokenType.NOT, regex: /^([Nn][Oo][Tt])\b/ },
	{ type: TokenType.PLUS, regex: /^\+/ },
	{ type: TokenType.MINUS, regex: /^-/ },
	{ type: TokenType.DIVISION, regex: /^\// },
	{ type: TokenType.MULTIPLICATION, regex: /^\*/ },
	{ type: TokenType.ASSIGNMENT, regex: /^=/ },
	{ type: TokenType.FOR_STATEMENT, regex: /^for\b/ },
	{ type: TokenType.RETURN, regex: /^return\b/ },
	{ type: TokenType.FUNCTION, regex: /^function\b/ },
	{ type: TokenType.BRACKET, regex: /^(\(|\))/ },
	{ type: TokenType.CURLY_BRACKET, regex: /^(\{|\})/ },
	{ type: TokenType.SQUARE_BRACKET, regex: /^(\[|\])/ },
	{ type: TokenType.SEPARATOR, regex: /^(;|,)/ },
	{ type: TokenType.IDENTIFIER, regex: /^([а-яА-Яa-zA-Z_][а-яА-Яa-zA-Z0-9_]*)(\.[а-яА-Яa-zA-Z_][а-яА-Яa-zA-Z0-9_]*)*/ }
];

export { TokenType, tokenTypeToRegexMap };