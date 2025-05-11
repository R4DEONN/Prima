import {Expression} from "./Expression";
import {Type} from "../Types/Type";
import {NodeType} from "../Types/NodeType";
import {CodeGenerator} from "../../CodeGeneration/CodeGenerator";

export class BinaryExpression extends Expression
{
	constructor(
		public left: Expression,
		public right: Expression,
		public operator: string,
		type: Type
	)
	{
		super(NodeType.BINARY_EXPRESSION, type);
	}

	generate(generator: CodeGenerator): void
	{
		this.left.generate(generator);
		this.right.generate(generator);

		switch (this.operator)
		{
			case '+':
				generator.emit(1, 'add');
				break;
			case '-':
				generator.emit(1, 'sub');
				break;
			case '*':
				generator.emit(1, 'mul');
				break;
			case '/':
				generator.emit(1, 'div');
				break;
			case '>':
				generator.emit(1, 'cgt');
				break;
			case '<':
				generator.emit(1, 'clt');
				break;
			case '==':
				generator.emit(1, 'ceq');
				break;
			default:
				throw new Error(`Unknown binary operator: ${this.operator}`);
		}
	}
}