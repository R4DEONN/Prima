import {ASTNode} from "./ASTNode";

export abstract class Statement extends ASTNode
{
    protected constructor(nodeType: string)
    {
        super(nodeType);
    }
}