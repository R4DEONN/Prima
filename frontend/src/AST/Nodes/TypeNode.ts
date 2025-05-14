import {Type} from "../Types/Type";
import {NodeType} from "../Types/NodeType";
import {CodeGenerator} from "../../CodeGeneration/CodeGenerator";
import {ASTNode} from "./ASTNode";

export class TypeNode extends ASTNode
{
    constructor(
        public type: Type
    )
    {
        super(NodeType.TYPE_NODE);
    }

    generate(generator: CodeGenerator): void
    {
        throw new Error("There is no code generating for TypeNopde");
    }
}