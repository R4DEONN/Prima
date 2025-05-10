import {Expression} from "./Expression";
import {NodeType} from "../Types/NodeType";
import {Type} from "../Types/Type";

export class MemberExpression extends Expression
{
    constructor(
        public object: Expression,
        public property: Expression,
        public computed: boolean,
        type: Type
    )
    {
        super(NodeType.MEMBER_EXPRESSION, type);
    }
}