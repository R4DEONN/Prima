import {Expression} from "./Expression";
import {Type} from "../Types/Type";
import {NodeType} from "../Types/NodeType";
import {CodeGenerator} from "../../CodeGeneration/CodeGenerator";

export class Literal extends Expression
{
	constructor(
		public value: string | boolean | number,
		public literalType: Type
	)
	{
		super(NodeType.LITERAL, literalType);
	}

	generate(generator: CodeGenerator): void
	{
		const index = generator.addConstant(this.type, this.value);
		generator.emit(1, 'const', index + 1);
	}
}