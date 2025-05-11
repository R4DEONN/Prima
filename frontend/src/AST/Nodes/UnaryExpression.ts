import {Type} from "../Types/Type";
import {Expression} from "./Expression";
import {NodeType} from "../Types/NodeType";
import {CodeGenerator} from "../../CodeGeneration/CodeGenerator";

export class UnaryExpression extends Expression
{
	constructor(
		public operator: string,
		public operand: Expression,
		public type: Type
	)
	{
		super(NodeType.UNARY_EXPRESSION, type);
	}

	generate(generator: CodeGenerator): void
	{
		this.operand.generate(generator);

		switch (this.operator)
		{
			case '!':
				generator.emit(1, 'not');
				break;
			case '-':
				generator.emit(1, 'neg');
				break;
			default:
				throw new Error(`Unknown unary operator: ${this.operator}`);
		}
	}
}