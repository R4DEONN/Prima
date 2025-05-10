import {Declaration} from "./Declaration";
import {Type} from "../Types/Type";
import {NodeType} from "../Types/NodeType";
import {Expression} from "./Expression";
import {Identifier} from "./Identifier";

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
}