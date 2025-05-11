import {ASTNode} from "../AST/Nodes/ASTNode";
import {Type} from "../AST/Types/Type";
import {BinaryExpression} from "../AST/Nodes/BinaryExpression";
import {UnaryExpression} from "../AST/Nodes/UnaryExpression";
import {Program} from "../AST/Nodes/Program";
import {Expression} from "../AST/Nodes/Expression";
import {ExpressionStatement} from "../AST/Nodes/ExpressionStatement";
import {BlockStatement} from "../AST/Nodes/BlockStatement";
import {IfStatement} from "../AST/Nodes/IfStatement";
import {Statement} from "../AST/Nodes/Statement";
import {Declaration} from "../AST/Nodes/Declaration";

export const actionHandlers: Record<string, (stack: ASTNode[]) => ASTNode> = {
    makeProgram: (stack) =>
    {
        const nodes: ASTNode[] = [];
        while (stack.length > 0)
        {
            const node = stack.shift();
            if (node)
            {
                nodes.push(node);
            }
        }
        return new Program(nodes);
    },

    makeExpressionStatement: (stack) =>
    {
        const expression = stack.pop();
        if (expression instanceof Expression)
        {
            return new ExpressionStatement(expression);
        }
        throw new Error("Expression expected. Got something else: " + expression.nodeType)
    },

    makeBlockStatement: (stack) =>
    {
        const nodes: ASTNode[] = [];
        while (stack.length > 0)
        {
            const node = stack.pop();
            if (!(node instanceof Statement) && !(node instanceof Declaration))
            {
                stack.push(node);
                break;
            }
            nodes.push(node);
        }
        return new BlockStatement(nodes.reverse());
    },

    makeIf: (stack) =>
    {
        const block = stack.pop();
        if (block instanceof BlockStatement)
        {
            const expression = stack.pop();
            if (expression instanceof Expression)
            {
                return new IfStatement(expression, block);
            }
            throw new Error("Expression for if expected. Got something else: " + expression.nodeType);
        }
        throw new Error("Block for if expected. Got something else: " + block.nodeType);
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
