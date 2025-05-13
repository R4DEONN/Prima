import {NodeType} from "../Types/NodeType";
import {CodeGenerator} from "../../CodeGeneration/CodeGenerator";
import {ASTNode} from "./ASTNode";

export class Marker extends ASTNode
{
    constructor(
        public value: string
    )
    {
        super(NodeType.MARKER);
    }

    generate(generator: CodeGenerator): void
    {
        throw new Error("Marker must be not in AST tree after analyzes");
    }
}