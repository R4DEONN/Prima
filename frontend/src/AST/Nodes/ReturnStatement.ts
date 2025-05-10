import {Statement} from "./Statement";
import {Expression} from "./Expression";
import {NodeType} from "../Types/NodeType";

export class ReturnStatement extends Statement
{
    constructor(
        public argument?: Expression
    )
    {
        super(NodeType.RETURN_STATEMENT);
    }
}