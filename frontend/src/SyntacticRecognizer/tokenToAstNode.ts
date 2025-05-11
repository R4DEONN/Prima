import {Token} from "../Common/Token";
import {TokenType} from "../Common/TokenType";
import {ASTNode} from "../AST/Nodes/ASTNode";
import {Literal} from "../AST/Nodes/Literal";
import {Identifier} from "../AST/Nodes/Identifier";
import {Type} from "../AST/Types/Type";

export function tokenToAstNode(token: Token): ASTNode | null
{
    switch (token.getType())
    {
        case TokenType.NUMBER:
            return new Literal(Number(token.getLexeme()), Type.NUMBER);
        case TokenType.STRING:
            return new Literal(token.getLexeme(), Type.STRING);
        case TokenType.TRUE:
        case TokenType.FALSE:
            return new Literal(token.getLexeme() === "true", Type.BOOL);
        case TokenType.IDENTIFIER:
            return new Identifier(token.getLexeme());
        default:
            return null;
    }
}
