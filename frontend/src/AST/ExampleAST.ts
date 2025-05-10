import {Program} from "./Nodes/Program";
import {BinaryExpression} from "./Nodes/BinaryExpression";
import {Literal} from "./Nodes/Literal";
import {Type} from "./Types/Type";
import {UnaryExpression} from "./Nodes/UnaryExpression";

const input = "!(5 - 4 > 3 * 2 == !0)";

const minusExpr = new BinaryExpression(
    new Literal(5, Type.NUMBER),
    new Literal(4, Type.NUMBER),
    "-",
    Type.NUMBER
);

const multiplyExpr = new BinaryExpression(
    new Literal(3, Type.NUMBER),
    new Literal(2, Type.NUMBER),
    "*",
    Type.NUMBER
);

const greaterExpr = new BinaryExpression(
    minusExpr,
    multiplyExpr,
    ">",
    Type.BOOL
);

const notZeroExpr = new UnaryExpression(
    "!",
    new Literal(0, Type.NUMBER),
    Type.BOOL
);

const equalityExpr = new BinaryExpression(
    greaterExpr,
    notZeroExpr,
    "==",
    Type.BOOL
);

const rootExpression = new UnaryExpression(
    "!",
    equalityExpr,
    Type.BOOL
);

const program = new Program([rootExpression]);

console.log(program);