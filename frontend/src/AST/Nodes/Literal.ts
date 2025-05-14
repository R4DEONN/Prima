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
		let index = generator.getConstantIndex(this.value);
		if (index == 0)
		{
			index = generator.addConstant(this.type, this.value);
		}
		generator.emit(1, 'const', index);
	}
}