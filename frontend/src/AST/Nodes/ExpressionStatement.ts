import {Statement} from "./Statement";
import {Expression} from "./Expression";
import {NodeType} from "../Types/NodeType";

export class ExpressionStatement extends Statement
{
    constructor(
        public expression: Expression
    )
    {
        super(NodeType.EXPRESSION_STATEMENT);
    }
}