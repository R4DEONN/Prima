import {Expression} from "./Expression";
import {Type} from "../Types/Type";
import {NodeType} from "../Types/NodeType";

export class Literal extends Expression
{
    constructor(
        public value: string | boolean | number,
        public literalType: Type
    )
    {
        super(NodeType.LITERAL, literalType);
    }
}