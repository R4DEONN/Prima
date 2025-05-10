import {Expression} from "./Expression";
import {NodeType} from "../Types/NodeType";
import {Type} from "../Types/Type";

export class Identifier extends Expression
{
    constructor(
        public name: string
    )
    {
        super(NodeType.IDENTIFIER, Type.IDENTIFIER);
    }
}