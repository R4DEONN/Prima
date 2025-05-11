import {ASTNode} from "./ASTNode";
import {Declaration} from "./Declaration";
import {NodeType} from "../Types/NodeType";
import {Statement} from "./Statement";
import {CodeGenerator} from "../../CodeGeneration/CodeGenerator";

export class Program extends ASTNode
{
	constructor(
		public body: Array<Statement | Declaration> = []
	)
	{
		super(NodeType.PROGRAM);
	}

	generate(generator: CodeGenerator): void
	{
		for (const node of this.body)
		{
			node.generate(generator);
		}
		if (generator.lastOp !== 'ret')
		{
			generator.emit(1, 'ret');
		}
	}
}