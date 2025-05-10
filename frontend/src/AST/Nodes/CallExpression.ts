import {Type} from "../Types/Type";
import {Expression} from "./Expression";
import {NodeType} from "../Types/NodeType";

export class CallExpression extends Expression
{
    constructor(
        public callee: Expression,
        public args: Expression[],
        type: Type
    )
    {
        super(NodeType.CALL_EXPRESSION, type);
    }
}