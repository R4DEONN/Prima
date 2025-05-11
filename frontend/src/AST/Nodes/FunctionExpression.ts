import {Expression} from "./Expression";
import {Parameter} from "./Parameter";
import {NodeType} from "../Types/NodeType";
import {Type} from "../Types/Type";
import {BlockStatement} from "./BlockStatement";
import {CodeGenerator} from "../../CodeGeneration/CodeGenerator";

export class FunctionExpression extends Expression
{
	constructor(
		public body: BlockStatement,
		public parameters: Parameter[],
		type: Type = Type.VOID
	)
	{
		super(NodeType.FUNCTION_EXPRESSION, type);
	}

	generate(generator: CodeGenerator): void
	{
		// const funcIndex = generator.addFunction(this);
		// generator.emit(1, 'func', funcIndex);
	}

}