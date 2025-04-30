import {Token, TokenType} from "../Lexer/Token";

class TokensConnector {
	private static toLower(str: string): string {
		return str.toLowerCase();
	}

	public static convertTokenData(token: Token): Token {
		if (token.getType() === TokenType.IDENTIFIER)
		{
			const lowerData = this.toLower(token.getData());
			if (lowerData === "true")
			{
				token.setData("t");
				return token;
			}
			else if (lowerData === "false")
			{
				token.setData("f");
				return token;
			}
		}

		if (token.getType() === TokenType.LOGICAL)
		{
			const lowerData = this.toLower(token.getData());
			if (lowerData === "<=")
			{
				token.setData("l");
				return token;
			}
			else if (lowerData === ">=")
			{
				token.setData("b");
				return token;
			}
			else if (lowerData === "!=")
			{
				token.setData("q");
				return token;
			}
		}

		const typeToPrefix = new Map<TokenType, string>([
			[TokenType.MOD, "m"],
			[TokenType.DIV, "d"],
			[TokenType.AND, "A"],
			[TokenType.OR, "O"],
			[TokenType.IDENTIFIER, "i"],
			[TokenType.STRING, "s"],
			[TokenType.NUMBER, "N"],
			[TokenType.NOT, "n"],
			[TokenType.SEPARATOR, "#"],
			[TokenType.ELSE_BLOCK, "J"],
			[TokenType.IF_STATEMENT, "H"],
			[TokenType.THEN, "Z"]
		]);

		const prefix = typeToPrefix.get(token.getType());
		if (prefix)
		{
			token.setData(prefix);
			return token;
		}

		return token;
	}

	public static convertTokens(tokens: Token[]): Token[] {
		return tokens.map(token => this.convertTokenData(token));
	}
}

export {TokensConnector, TokenType};