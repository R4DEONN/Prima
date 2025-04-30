import {Entity, EntityType, NonTerminal, Terminal} from "./Symbol";

class Dictionary
{
	private _nonTerminals: Array<NonTerminal> = [];
	private _terminals: Array<Terminal> = [];
	private _allEntities: Array<Entity> = [];

	add(entity: Entity): void
	{
		if (this._allEntities.some(e => e.equals(entity)))
		{
			return;
		}
		this._allEntities.push(entity);

		if (entity.getType() === EntityType.NON_TERMINAL)
		{
			const nonTerminal = entity as NonTerminal;
			this._nonTerminals.push(nonTerminal);
		}
		else
		{
			const terminal = entity as Terminal;
			this._terminals.push(terminal);
		}
	}

	computeFirstStar(): Map<string, Set<string>>
	{
		const size = this._nonTerminals.length;
		const adjacencyMatrix: boolean[][] = Array.from({length: size}, () => Array(size).fill(false));
		const nonTerminalIndexMap: Map<string, number> = new Map();

		this._nonTerminals.forEach((nt, i) => nonTerminalIndexMap.set(nt.getValue(), i));

		for (const nonTerminal of this._nonTerminals)
		{
			for (const rule of nonTerminal.getRules())
			{
				if (rule.length > 0)
				{
					const firstSymbol = rule[0];
					const from = nonTerminalIndexMap.get(nonTerminal.getValue())!;
					if (firstSymbol.getType() === EntityType.NON_TERMINAL)
					{
						const to = nonTerminalIndexMap.get(firstSymbol.getValue())!;
						adjacencyMatrix[from][to] = true;
					}
				}
			}
		}

		// Floyd-Warshall algorithm
		for (let k = 0; k < size; k++)
		{
			for (let i = 0; i < size; i++)
			{
				for (let j = 0; j < size; j++)
				{
					adjacencyMatrix[i][j] = adjacencyMatrix[i][j] || (adjacencyMatrix[i][k] && adjacencyMatrix[k][j]);
				}
			}
		}

		const firstStar: Map<string, Set<string>> = new Map();
		let isChanged: boolean;

		do
		{
			isChanged = false;
			for (const nonTerminal of this._nonTerminals)
			{
				const nonTerminalValue = nonTerminal.getValue();
				for (const rule of nonTerminal.getRules())
				{
					if (rule.length > 0)
					{
						const firstSymbol = rule[0];
						if (firstSymbol.getType() === EntityType.TERMINAL)
						{
							const terminalValue = firstSymbol.getValue();
							if (!firstStar.get(nonTerminalValue)?.has(terminalValue))
							{
								if (!firstStar.has(nonTerminalValue))
								{
									firstStar.set(nonTerminalValue, new Set());
								}
								firstStar.get(nonTerminalValue)!.add(terminalValue);
								isChanged = true;
							}
						}
						else
						{
							const firstSet = firstStar.get(firstSymbol.getValue());
							if (firstSet)
							{
								for (const terminal of firstSet)
								{
									if (!firstStar.get(nonTerminalValue)?.has(terminal))
									{
										if (!firstStar.has(nonTerminalValue))
										{
											firstStar.set(nonTerminalValue, new Set());
										}
										firstStar.get(nonTerminalValue)!.add(terminal);
										isChanged = true;
									}
								}
							}
						}
					}
				}
			}
		} while (isChanged);

		return firstStar;
	}

	computeFollow(firstStar: Map<string, Set<string>>): Map<string, Set<string>>
	{
		const followSets: Map<string, Set<string>> = new Map();
		if (this._nonTerminals.length === 0) return followSets;

		let isChanged: boolean;
		do
		{
			isChanged = false;
			for (const nonTerminal of this._nonTerminals)
			{
				const A = nonTerminal.getValue();
				for (const rule of nonTerminal.getRules())
				{
					for (let i = 0; i < rule.length; i++)
					{
						const symbol = rule[i];
						if (symbol.getType() === EntityType.NON_TERMINAL)
						{
							const B = symbol.getValue();
							if (i + 1 < rule.length)
							{
								const nextSymbol = rule[i + 1];
								if (nextSymbol.getType() === EntityType.TERMINAL)
								{
									if (!followSets.get(B)?.has(nextSymbol.getValue()))
									{
										if (!followSets.has(B))
										{
											followSets.set(B, new Set());
										}
										followSets.get(B)!.add(nextSymbol.getValue());
										isChanged = true;
									}
								}
								else
								{
									const firstSet = firstStar.get(nextSymbol.getValue());
									if (firstSet)
									{
										for (const terminal of firstSet)
										{
											if (terminal !== "e" && !followSets.get(B)?.has(terminal))
											{
												if (!followSets.has(B))
												{
													followSets.set(B, new Set());
												}
												followSets.get(B)!.add(terminal);
												isChanged = true;
											}
										}
									}
									if (firstSet?.has("e"))
									{
										const followA = followSets.get(A);
										if (followA)
										{
											for (const terminal of followA)
											{
												if (!followSets.get(B)?.has(terminal))
												{
													if (!followSets.has(B))
													{
														followSets.set(B, new Set());
													}
													followSets.get(B)!.add(terminal);
													isChanged = true;
												}
											}
										}
									}
								}
							}
							else
							{
								const followA = followSets.get(A);
								if (followA)
								{
									for (const terminal of followA)
									{
										if (!followSets.get(B)?.has(terminal))
										{
											if (!followSets.has(B))
											{
												followSets.set(B, new Set());
											}
											followSets.get(B)!.add(terminal);
											isChanged = true;
										}
									}
								}
							}
						}
					}
				}
			}
		} while (isChanged);

		return followSets;
	}

	getNonTerminals(): Array<NonTerminal>
	{
		return this._nonTerminals;
	}

	getTerminals(): Array<Terminal>
	{
		return this._terminals;
	}

	getAllEntities(): Array<Entity>
	{
		return this._allEntities;
	}
}

export {Dictionary};