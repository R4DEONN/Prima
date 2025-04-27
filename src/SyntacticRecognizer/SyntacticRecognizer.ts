type Action =
	| { type: 'shift', state: number }
	| { type: 'reduce', production: number }
	| { type: 'accept' }
	| { type: 'error' };

type SLRTable = {
	action: (state: number, symbol: string) => Action;
	goto: (state: number, nonTerminal: string) => number;
	rules: { left: string, right: string[] }[];
};

class SyntacticRecognizer
{
	private stateStack: number[] = [0];
	private symbolStack: string[] = [];
	private readonly input: string[];
	private position = 0;

	constructor(
		private table: SLRTable,
		input: string[]
	)
	{
		this.input = [...input, '#'];
	}

	public parse(): boolean
	{
		while (true)
		{
			const currentState = this.stateStack[this.stateStack.length - 1];
			const currentSymbol = this.input[this.position];

			const action = this.table.action(currentState, currentSymbol);

			console.log(`State: ${currentState}, Symbol: ${currentSymbol}, Action:`, action);
			console.log(`State Stack:`, this.stateStack);
			console.log(`Symbol Stack:`, this.symbolStack);
			console.log(`Input Left:`, this.input.slice(this.position));

			switch (action.type)
			{
				case 'shift':
					// Push symbol and new state to respective stacks
					this.symbolStack.push(currentSymbol);
					this.stateStack.push(action.state);
					this.position++;
					break;

				case 'reduce':
					const production = this.table.rules[action.production];
					console.log(`Reducing by ${production.left} -> ${production.right.join(' ')}`);

					// Handle reduction - pop rhs from both stacks
					if (production.right[0] !== 'ε')
					{ // Skip for epsilon productions
						this.stateStack = this.stateStack.slice(0, -production.right.length);
						this.symbolStack = this.symbolStack.slice(0, -production.right.length);
					}

					// Push LHS and new state
					const newState = this.stateStack[this.stateStack.length - 1];
					const gotoState = this.table.goto(newState, production.left);

					this.symbolStack.push(production.left);
					this.stateStack.push(gotoState);
					break;

				case 'accept':
					console.log('Parsing completed successfully!');
					return true;

				case 'error':
					console.error(`Syntax error at position ${this.position}, symbol '${currentSymbol}'`);
					console.error(`State Stack:`, this.stateStack);
					console.error(`Symbol Stack:`, this.symbolStack);
					console.error(`Input Left:`, this.input.slice(this.position));
					return false;
			}
		}
	}
}

export {SyntacticRecognizer};