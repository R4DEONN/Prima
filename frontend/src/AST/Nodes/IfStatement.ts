import {Statement} from "./Statement";
import {NodeType} from "../Types/NodeType";
import {CodeGenerator} from "../../CodeGeneration/CodeGenerator";
import { Expression } from "./Expression";
import {BlockStatement} from "./BlockStatement";

export class IfStatement extends Statement
{
	static counter: number = 0;
	private ifElsePart: string = "";
	private ifExitPart: string = "";
	constructor(
		public condition: Expression,
		public consequent: BlockStatement,
		public alternate?: BlockStatement
	)
	{
		super(NodeType.IF_STATEMENT);
		IfStatement.counter++;
		this.ifElsePart = "else" + IfStatement.counter;
		this.ifExitPart = "endif" + IfStatement.counter;
	}

	generate(generator: CodeGenerator): void
	{
		this.condition.generate(generator);
		generator.emit(1, "jmpfalse " + this.ifExitPart);
		this.consequent.generate(generator);
		generator.addLabel(this.ifExitPart);
	}
}