import {Expression} from "./Expression";
import {Parameter} from "./Parameter";
import {NodeType} from "../Types/NodeType";
import {Type} from "../Types/Type";
import {BlockStatement} from "./BlockStatement";

export class FunctionExpression extends Expression
{
    constructor(
        public body: BlockStatement,
        public parameters: Parameter[],
        type: Type = Type.VOID
    )
    {
        super(NodeType.FUNCTION_EXPRESSION, type);
    }
}