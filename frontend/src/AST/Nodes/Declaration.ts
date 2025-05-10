import {ASTNode} from "./ASTNode";
import {Identifier} from "./Identifier";

export class Declaration extends ASTNode
{
    constructor(
        nodeType: string,
        public name: Identifier
    )
    {
        super(nodeType);
    }
}