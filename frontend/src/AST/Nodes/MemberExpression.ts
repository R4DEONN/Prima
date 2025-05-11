import {Expression} from "./Expression";
import {NodeType} from "../Types/NodeType";
import {Type} from "../Types/Type";
import {CodeGenerator} from "../../CodeGeneration/CodeGenerator";
import {Identifier} from "./Identifier";

export class MemberExpression extends Expression
{
	constructor(
		public object: Expression,
		public property: Expression,
		public computed: boolean,
		type: Type
	)
	{
		super(NodeType.MEMBER_EXPRESSION, type);
	}

	generate(generator: CodeGenerator): void
	{
		this.object.generate(generator);
		if (this.computed)
		{
			this.property.generate(generator);
			generator.emit(1, 'get_prop');
		}
		else
		{
			const propIndex = generator.addConstant(Type.STRING, (this.property as Identifier).name);
			generator.emit(1, 'const', propIndex + 1);
			generator.emit(1, 'get_prop');
		}
	}
}