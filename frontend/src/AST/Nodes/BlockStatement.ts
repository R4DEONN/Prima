import {Statement} from "./Statement";
import {Declaration} from "./Declaration";
import {NodeType} from "../Types/NodeType";
import {CodeGenerator} from "../../CodeGeneration/CodeGenerator";

export class BlockStatement extends Statement
{
	constructor(
		public body: Array<Statement | Declaration> = []
	)
	{
		super(NodeType.BLOCK_STATEMENT);
	}

	generate(generator: CodeGenerator): void
	{
		for (const stmt of this.body)
		{
			stmt.generate(generator);
		}
	}
}