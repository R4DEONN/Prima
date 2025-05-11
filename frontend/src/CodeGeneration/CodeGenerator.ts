import {Type} from "../AST/Types/Type";

export class CodeGenerator
{
	private constants: Array<{ type: string, value: any }> = [];
	private code: Array<{ line?: number, op: string, arg?: number }> = [];
	public lastOp: string = '';
	private variables: Map<string, {index: number, isConst: boolean}> = new Map();
	private nextVarIndex = 0;
	private labels: Map<string, number> = new Map();
	private nextLabelId = 0;
	// private functions: FunctionDefinition[] = [];

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
		return this.constants.length - 1;
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

	createLabel(): string {
		const label = `L${this.nextLabelId++}`;
		this.labels.set(label, -1); // Пока не размещена
		return label;
	}

	placeLabel(label: string): void {
		this.labels.set(label, this.code.length);
	}

	// addFunction(func: FunctionDefinition): number {
	// 	const index = this.functions.length;
	// 	this.functions.push(func);
	// 	return index;
	// }

	getBreakLabel(): string {
		// Должен возвращать метку для break из текущего контекста
		return 'break_label';
	}

	getContinueLabel(): string {
		// Должен возвращать метку для continue из текущего контекста
		return 'continue_label';
	}
}