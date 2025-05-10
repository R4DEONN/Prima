import {Statement} from "./Statement";
import {Declaration} from "./Declaration";
import {NodeType} from "../Types/NodeType";

export class BlockStatement extends Statement
{
    constructor(
        public body: Array<Statement | Declaration> = []
    )
    {
        super(NodeType.BLOCK_STATEMENT);
    }
}