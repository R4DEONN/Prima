import {Type} from "../AST/Types/Type";

export class CodeGenerator
{
	private constants: Array<{ type: string, value: any }> = [];
	private code: Array<{ line?: number, op: string, arg?: number }> = [];
	public lastOp: string = '';
	private variables: Map<string, {index: number, isConst: boolean}> = new Map();
	private nextVarIndex = 0;

	addConstant(type: Type, value: any): number
	{
		const index = this.constants.findIndex(c =>
			c.type === type && c.value === value
		);

		if (index >= 0)
		{
			return index;
		}

		this.constants.push({type, value});
		return this.constants.length;
	}

	getConstantIndex(value: any): number
	{
		return this.constants.findIndex(constant => constant.value == value) + 1;
	}

	addLabel(name: string): void
	{
		this.code.push({op: name + ":"})
	}

	emit(line: number, op: string, arg?: number): void
	{
		this.code.push({line, op, arg});
		this.lastOp = op;
	}

	getConstants(): string[]
	{
		return this.constants.map(c => `${c.type} ${c.value}`);
	}

	getCode(): string[]
	{
		return this.code.map(i =>
			`${i.line !== undefined ? i.line + ' ' : ''}${i.op}${i.arg !== undefined ? ' ' + i.arg : ''}`
		);
	}

	declareVariable(name: string, isConst: boolean): void {
		if (!this.variables.has(name)) {
			this.variables.set(name, {index: this.nextVarIndex++, isConst});
		}
	}

	getVariableIndex(name: string): number {
		const varInfo = this.variables.get(name);
		if (!varInfo) throw new Error(`Undefined variable: ${name}`);
		return varInfo.index;
	}
}