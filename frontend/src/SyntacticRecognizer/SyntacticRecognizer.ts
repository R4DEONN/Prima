interface SLRTable {
	[state: string]: {
		[token: string]: string;
	};
}

export class SyntacticRecognizer
{
	private readonly _table: SLRTable;
	private _tokens: string[] = [];
	private _stateStack: string[] = ['<Z>'];
	private _pointer = 0;
	private _endCount = 0;

	constructor(jsonTable: string)
	{
		this._table = JSON.parse(jsonTable);
	}

	public parse(input: string): boolean
	{
		this._tokens = input.split(/\s+/).filter(t => t !== "");

		while (this._pointer <= this._tokens.length)
		{
			const currentState = this._currentState;
			const currentToken = this._currentToken;

			if (currentState === "OK")
			{
				this._stateStack = [];
				this._logCurrentState();
				console.log("Успешный разбор!");
				return true;
			}

			this._logCurrentState();

			const action = this._getAction(currentState, currentToken);

			if (!action)
			{
				console.error(`Ошибка: Нет действия для State=${currentState}, Token=${currentToken}`);
				return false;
			}

			if (action.startsWith("R"))
			{
				this._handleReduce(action)
			}
			else
			{
				this._handleShift(action, currentToken);
			}
		}

		return false;
	}

	private get _currentState(): string
	{
		return this._stateStack[this._stateStack.length - 1];
	}

	private get _currentToken(): string
	{
		return this._pointer <= this._tokens.length ? this._tokens[this._pointer] : "<Z>";
	}

	private _getAction(state: string, token: string): string | undefined
	{
		return (this._table[state])?.[token];
	}

	private _handleReduce(action: string): void
	{
		const {symbol, count} = this._parseReduceAction(action);

		this._stateStack.splice(-count, count);

		console.log(`Символ: ${symbol}`);

		const newState = this._currentState;
		const nextState = this._getAction(newState, symbol);

		console.log(`Новое состояние ${newState}`);
		console.log(`Гоу ту ключ ${symbol}`);
		console.log(`След состояние ${nextState}`);

		if (!nextState)
		{
			throw new Error(`Ошибка: Нет перехода после свертки для ${symbol}`);
		}

		this._stateStack.push(nextState);

		if (this._currentToken == '~#~')
		{
			this._endCount++
		}
	}

	private _parseReduceAction(action: string): { symbol: string; count: number }
	{
		const match = action.match(/^R([<~][^>\s~]+[>~])(\d+)/);
		if (!match)
		{
			throw new Error(`Неверный формат свертки: ${action}`);
		}

		const [_, symbol, countStr] = match;
		return {symbol, count: parseInt(countStr, 10)};
	}

	private _handleShift(action: string, token: string): void
	{
		this._stateStack.push(action);
		this._pointer++;
	}

	private _logCurrentState(): void
	{
		console.log();
		console.log(`State: ${this._currentState}, Token: ${this._currentToken}`);
		console.log(`Stack states=[${this._stateStack}]`);
	}
}