import {Expression} from "./Expression";
import {NodeType} from "../Types/NodeType";
import {Type} from "../Types/Type";
import {CodeGenerator} from "../../CodeGeneration/CodeGenerator";

export class Identifier extends Expression
{
	constructor(
		public name: string
	)
	{
		super(NodeType.IDENTIFIER, Type.IDENTIFIER);
	}

	generate(generator: CodeGenerator): void
	{
		generator.emit(1, 'load', generator.getVariableIndex(this.name));
	}
}