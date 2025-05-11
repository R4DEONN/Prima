import {ASTNode} from "../AST/Nodes/ASTNode";
import {Type} from "../AST/Types/Type";
import {BinaryExpression} from "../AST/Nodes/BinaryExpression";
import {UnaryExpression} from "../AST/Nodes/UnaryExpression";
import {Program} from "../AST/Nodes/Program";
import {Expression} from "../AST/Nodes/Expression";

export const actionHandlers: Record<string, (stack: ASTNode[]) => ASTNode> = {
    makeProgram: (stack) =>
    {
        const nodes: ASTNode[] = [];
        while (stack.length > 0)
        {
            const node = stack.shift();
            if (node) nodes.push(node);
        }
        return new Program(nodes);
    },

    makeAdd: bin("+", Type.NUMBER),
    makeSub: bin("-", Type.NUMBER),
    makeMul: bin("*", Type.NUMBER),
    makeDiv: bin("/", Type.NUMBER),
    makeMod: bin("%", Type.NUMBER),
    makePow: bin("**", Type.NUMBER),

    makeEqual: bin("==", Type.BOOL),
    makeNotEqual: bin("!=", Type.BOOL),
    makeGreater: bin(">", Type.BOOL),
    makeGreaterEq: bin(">=", Type.BOOL),
    makeLess: bin("<", Type.BOOL),
    makeLessEq: bin("<=", Type.BOOL),

    makeAnd: bin("&&", Type.BOOL),
    makeOr: bin("||", Type.BOOL),

    makeUnaryMinus: unary("-", Type.NUMBER),
    makeNot: unary("!", Type.BOOL),
};

function bin(op: string, type: Type): (stack: ASTNode[]) => ASTNode
{
    return (stack) =>
    {
        const right = stack.pop() as Expression;
        const left = stack.pop() as Expression;
        return new BinaryExpression(left, right, op, type);
    };
}

function unary(op: string, type: Type): (stack: ASTNode[]) => ASTNode
{
    return (stack) =>
    {
        const operand = stack.pop() as Expression;
        return new UnaryExpression(op, operand, type);
    };
}
