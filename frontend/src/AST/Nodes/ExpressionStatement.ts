import {Statement} from "./Statement";
import {Expression} from "./Expression";
import {NodeType} from "../Types/NodeType";
import {CodeGenerator} from "../../CodeGeneration/CodeGenerator";
import {Type} from "../Types/Type";

export class ExpressionStatement extends Statement
{
	constructor(
		public expression: Expression
	)
	{
		super(NodeType.EXPRESSION_STATEMENT);
	}

	generate(generator: CodeGenerator): void
	{
		this.expression.generate(generator);
		// Для выражений-операторов удаляем результат со стека
		if (this.expression.type !== Type.VOID)
		{
			generator.emit(1, 'pop');
		}
	}
}