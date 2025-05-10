import {ASTNode} from "./ASTNode";
import { Declaration } from "./Declaration";
import {NodeType} from "../Types/NodeType";
import {Statement} from "./Statement";

export class Program extends ASTNode
{
    constructor(
        public body: Array<Statement | Declaration>
    )
    {
        super(NodeType.PROGRAM)
    }
}