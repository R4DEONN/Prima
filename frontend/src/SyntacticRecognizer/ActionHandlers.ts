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
import {Marker} from "../AST/Nodes/Marker";
import {TypeNode} from "../AST/Nodes/TypeNode";
import {Identifier} from "../AST/Nodes/Identifier";
import {VariableDeclaration} from "../AST/Nodes/VariableDeclaration";

export const BLOCK_START = new Marker("BLOCK_START");

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

            if (node == BLOCK_START)
            {
                break;
            }

            if (!(node instanceof Statement) && !(node instanceof Declaration))
            {
                throw new Error("Statement or Declaration expected. Got: " + node.nodeType);
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

    makeElse: (stack) =>
    {
        const block = stack.pop();
        if (block instanceof BlockStatement)
        {
            const ifStatement = stack.pop();
            if (ifStatement instanceof IfStatement)
            {
                return new IfStatement(ifStatement.condition, ifStatement.consequent, block);
            }
            throw new Error("IfStatement for else expected. Got something else: " + ifStatement.nodeType);
        }
        throw new Error("Block for else expected. Got something else: " + block.nodeType);
    },

    makeNumberType: () =>
    {
        return new TypeNode(Type.NUMBER);
    },

    makeConstDeclaration: (stack) =>
    {
        const expression = stack.pop();
        if (expression instanceof Expression)
        {
            const type = stack.pop();
            if (type instanceof TypeNode)
            {
                const identifier = stack.pop();
                if (identifier instanceof Identifier)
                {
                    return new VariableDeclaration("const", identifier, type.type, expression)
                }
                throw new Error("Identifier for const declaration expected. Got something else: " + identifier.nodeType);
            }
            throw new Error("Type for const declaration expected. Got something else: " + type.nodeType);
        }
        throw new Error("Expression for const declaration expected. Got something else: " + expression.nodeType);
    },

    makeVarDeclaration: (stack) =>
    {
        const type = stack.pop();
        if (type instanceof TypeNode)
        {
            const identifier = stack.pop();
            if (identifier instanceof Identifier)
            {
                return new VariableDeclaration("var", identifier, type.type)
            }
            throw new Error("Identifier for var declaration expected. Got something else: " + identifier.nodeType);
        }
        throw new Error("Type for var declaration expected. Got something else: " + type.nodeType);
    },

    makeVarAssDeclaration: (stack) =>
    {
        const expression = stack.pop();
        if (expression instanceof Expression)
        {
            const varDeclaration = stack.pop();
            if (varDeclaration instanceof VariableDeclaration)
            {
                return new VariableDeclaration(varDeclaration.kind, varDeclaration.name, varDeclaration.variableType, expression);
            }
            throw new Error("Variable declaration expected. Got something else: " + varDeclaration.nodeType);
        }
        throw new Error("Expression for const declaration expected. Got something else: " + expression.nodeType);
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
