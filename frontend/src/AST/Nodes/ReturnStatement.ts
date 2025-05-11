import {Statement} from "./Statement";
import {Expression} from "./Expression";
import {NodeType} from "../Types/NodeType";
import {CodeGenerator} from "../../CodeGeneration/CodeGenerator";

export class ReturnStatement extends Statement
{
	constructor(
		public argument?: Expression
	)
	{
		super(NodeType.RETURN_STATEMENT);
	}

	generate(generator: CodeGenerator): void
	{
		if (this.argument)
		{
			this.argument.generate(generator);
		}
		else
		{
			generator.emit(1, 'push_null');
		}
		generator.emit(1, 'ret');
	}
}