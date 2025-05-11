import {CodeGenerator} from "../../CodeGeneration/CodeGenerator";

export abstract class ASTNode
{
    protected constructor(
        public nodeType: string
    )
    {
    }

    abstract generate(generator: CodeGenerator): void;
}