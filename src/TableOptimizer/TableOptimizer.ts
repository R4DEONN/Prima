import {Entity, EntityType, NonTerminal, Terminal} from "./Symbol";
import {Dictionary} from "./Dictionary";

namespace GrammarOptimizer
{
	export function optimize(input: string, output: (text: string) => void): void
	{
		const dictionary = createDictionaryFromInput(input);

		const firstStar = dictionary.computeFirstStar();
		const follow = dictionary.computeFollow(firstStar);

		for (const nonTerminal of dictionary.getNonTerminals())
		{
			for (const rule of nonTerminal.getRules())
			{
				let result = `${nonTerminal.getValue()} -> `;
				for (const symbol of rule)
				{
					result += symbol.getValue();
				}
				result += " | ";
				let isFirst = true;

				for (const guidingSymbol of firstStar.get(nonTerminal.getValue()) || [])
				{
					if (
						rule[0].getType() === EntityType.TERMINAL &&
						rule[0].getValue() === guidingSymbol
					)
					{
						if (!isFirst)
						{
							result += " ";
						}
						isFirst = false;
						if (guidingSymbol === "e")
						{
							let isSecondFirst = true;
							for (const followSymbol of follow.get(nonTerminal.getValue()) || [])
							{
								if (!isSecondFirst)
								{
									result += " ";
								}
								isSecondFirst = false;
								result += followSymbol;
							}
							continue;
						}
						result += guidingSymbol;
						continue;
					}
					if (rule[0].getType() === EntityType.NON_TERMINAL)
					{
						const firstSet = firstStar.get(rule[0].getValue());
						if (firstSet?.has(guidingSymbol))
						{
							if (!isFirst)
							{
								result += " ";
							}
							isFirst = false;
							result += guidingSymbol;
						}
					}
				}
				output(result + "\n");
			}
		}
	}

	function createDictionaryFromInput(input: string): Dictionary
	{
		const dictionary = new Dictionary();
		const rows = input.split("\n");
		const ruleRegex = /^<([^>]+)>\s*->\s*(.+)$/;
		const symbolRegex = /<[^>]*>?|[^<]/g;

		for (const row of rows)
		{
			const match = row.match(ruleRegex);
			if (match)
			{
				const left = `<${match[1]}>`;
				const right = match[2];

				let nonTerminal = dictionary.getNonTerminals().find(nt => nt.getValue() === left);
				if (!nonTerminal)
				{
					nonTerminal = new NonTerminal(left);
					dictionary.add(nonTerminal);
				}

				const ruleSymbols: Entity[] = [];
				const matches = right.matchAll(symbolRegex);
				for (const match of matches)
				{
					const symbol = match[0];
					if (symbol.startsWith("<") && symbol.endsWith(">"))
					{
						ruleSymbols.push(new NonTerminal(symbol));
					}
					else
					{
						ruleSymbols.push(new Terminal(symbol));
					}
				}
				nonTerminal.addRule(ruleSymbols);
			}
		}
		return dictionary;
	}
}

export {GrammarOptimizer};