type Action =
	| { type: 'shift', state: number }
	| { type: 'reduce', production: number }
	| { type: 'accept' }
	| { type: 'error' };

export type Rule = {
	left: string;
	right: string[];
};

type SLRTable = {
	action: (state: number, symbol: string) => Action;
	goto: (state: number, nonTerminal: string) => number;
	rule: Rule[];
};

class SyntacticRecognizer
{
	private _stateStack: number[] = [0];
	private _symbolStack: string[] = [];
	private readonly _input: string[];
	private _position = 0;

	constructor(
		private table: SLRTable,
		input: string[]
	)
	{
		this._input = [...input, '#'];
	}

	public parse(): boolean
	{
		while (true)
		{
			const currentState = this._stateStack[this._stateStack.length - 1];
			const currentSymbol = this._input[this._position];

			const action = this.table.action(currentState, currentSymbol);

			console.log(`State: ${currentState}, Symbol: ${currentSymbol}, Action:`, action);
			console.log(`State Stack:`, this._stateStack);
			console.log(`Symbol Stack:`, this._symbolStack);
			console.log(`Input Left:`, this._input.slice(this._position));

			switch (action.type)
			{
				case 'shift':
					// Push symbol and new state to respective stacks
					this._symbolStack.push(currentSymbol);
					this._stateStack.push(action.state);
					this._position++;
					break;

				case 'reduce':
					const production = this.table.rule[action.production];
					console.log(`Reducing by ${production.left} -> ${production.right.join(' ')}`);

					// Handle reduction - pop rhs from both stacks
					if (production.right[0] !== 'ε')
					{ // Skip for epsilon productions
						this._stateStack = this._stateStack.slice(0, -production.right.length);
						this._symbolStack = this._symbolStack.slice(0, -production.right.length);
					}

					// Push LHS and new state
					const newState = this._stateStack[this._stateStack.length - 1];
					const gotoState = this.table.goto(newState, production.left);

					this._symbolStack.push(production.left);
					this._stateStack.push(gotoState);
					break;

				case 'accept':
					console.log('Parsing completed successfully!');
					return true;

				case 'error':
					console.error(`Syntax error at position ${this._position}, symbol '${currentSymbol}'`);
					console.error(`State Stack:`, this._stateStack);
					console.error(`Symbol Stack:`, this._symbolStack);
					console.error(`Input Left:`, this._input.slice(this._position));
					return false;
			}
		}
	}
}

export {SyntacticRecognizer, SLRTable};