import {ASTNode} from "./ASTNode";
import {Identifier} from "./Identifier";
import {CodeGenerator} from "../../CodeGeneration/CodeGenerator";

export abstract class Declaration extends ASTNode
{
    protected constructor(
        nodeType: string,
        public name: Identifier
    )
    {
        super(nodeType);
    }
}