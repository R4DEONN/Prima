import {Declaration} from "./Declaration";
import {Type} from "../Types/Type";
import {NodeType} from "../Types/NodeType";
import {Expression} from "./Expression";
import {Identifier} from "./Identifier";
import {CodeGenerator} from "../../CodeGeneration/CodeGenerator";

export class VariableDeclaration extends Declaration
{
    constructor(
        public kind: "const" | "var",
        name: Identifier,
        public variableType: Type,
        public initializer?: Expression
    )
    {
        super(NodeType.VARIABLE_DECLARATION, name);
    }

    generate(generator: CodeGenerator): void
    {
        if (this.initializer)
        {
            this.initializer.generate(generator);
            const index = generator.addConstant(Type.STRING, `"${this.name.name}"`);
            generator.emit(1, "defglobal", index);
        }
    }
}