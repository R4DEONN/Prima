import {Type} from "../Types/Type";
import {Expression} from "./Expression";
import {NodeType} from "../Types/NodeType";
import {CodeGenerator} from "../../CodeGeneration/CodeGenerator";

export class CallExpression extends Expression
{
	constructor(
		public callee: Expression,
		public args: Expression[],
		type: Type
	)
	{
		super(NodeType.CALL_EXPRESSION, type);
	}

	generate(generator: CodeGenerator): void
	{
		this.callee.generate(generator);
		for (const arg of this.args)
		{
			arg.generate(generator);
		}
		generator.emit(1, 'call', this.args.length);
	}
}