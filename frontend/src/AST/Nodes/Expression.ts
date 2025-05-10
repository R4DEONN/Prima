import {ASTNode} from "./ASTNode";
import {Type} from "../Types/Type";

export abstract class Expression extends ASTNode
{
    protected constructor(
        nodeType: string,
        public type: Type
    )
    {
        super(nodeType);
    }
}