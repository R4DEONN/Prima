import {Type} from "../Types/Type";
import {Identifier} from "./Identifier";

export class Parameter
{
    constructor(
        public name: Identifier,
        public paramType: Type
    )
    {
    }
}