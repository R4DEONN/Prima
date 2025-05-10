import {Expression} from "./Expression";
import {Type} from "../Types/Type";
import {NodeType} from "../Types/NodeType";

export class BinaryExpression extends Expression
{
    constructor(
        public left: Expression,
        public right: Expression,
        public operator: string,
        type: Type
    )
    {
        super(NodeType.BINARY_EXPRESSION, type);
    }
}