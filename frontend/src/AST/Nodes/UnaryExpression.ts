import {Type} from "../Types/Type";
import {Expression} from "./Expression";
import {NodeType} from "../Types/NodeType";

export class UnaryExpression extends Expression
{
    constructor(
        public operator: string,
        public operand: Expression,
        public type: Type
    )
    {
        super(NodeType.UNARY_EXPRESSION, type);
    }
}