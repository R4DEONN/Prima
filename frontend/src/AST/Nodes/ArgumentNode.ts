import {Expression} from "./Expression";
import {NodeType} from "../Types/NodeType";
import {CodeGenerator} from "../../CodeGeneration/CodeGenerator";

export class ArgumentNode extends Expression
{
	constructor(
		public expression: Expression
	)
	{
		super(NodeType.ARGUMENT, expression.type);
	}

	generate(generator: CodeGenerator): void
	{
	}
}