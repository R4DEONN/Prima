import * as fs from "fs";

class Symbol
{
    constructor(
        public symbol: string,
        public row: number,
        public position: number,
    )
    {
    }

    public toString(): string
    {
        return `${this.symbol}${this.row},${this.position}`;
    }

}


class GrammarRule
{
    constructor(
        public num: number,
        public leftPart: string,
        public rightPart: Symbol[],
    )
    {
    }
}

class GrammarParser
{
    constructor(
        public fileName: string,
    )
    {
    }

    public parseGrammar(): GrammarRule[]
    {
        const buffer = fs.readFileSync(this.fileName);
        const fileRows = buffer.toString().split(/\r?\n/);

        const rules: GrammarRule[] = [];
        let ruleNumber = 0;

        for (const row of fileRows)
        {
            const trimmedRow = row.trim();
            if (!trimmedRow) continue;

            const parts = trimmedRow.split('->').map(p => p.trim());
            if (parts.length !== 2 || !parts[0] || !parts[1]) continue;

            const leftPart = parts[0];

            const rightPart = this._parseSymbols(parts[1], ruleNumber);

            rules.push(new GrammarRule(
                ruleNumber++,
                leftPart,
                rightPart,
            ));
        }

        return rules;
    }

    private _parseSymbols(str: string, row: number): Symbol[]
    {
        const tokens = str
            .split(/(<[^>]+>|~[^~]+~)/)
            .filter(token => token && token.trim())
            .map(token => token.trim());

        return tokens.map((token, index) =>
        {
            return new Symbol(token, row, index + 1);
        });
    }
}

class TableGenerator
{
    constructor(
        public rules: GrammarRule[]
    )
    {
    }

    private mergedStates: Map<string, string> = new Map<string, string>();

    public generateTable(): Map<string, Map<string, string>>
    {
        const table: Map<string, Map<string, string>> = new Map<string, Map<string, string>>();
        const columnHeaders: string[] = this._getColumnHeaders();

        const firstRow: Map<string, string> = new Map<string, string>();
        const firstRule = this.rules[0];

        const firstRuleFirsts: Symbol[] = this._computeFirstSet(firstRule.leftPart, new Set<string>());

        for (const header of columnHeaders)
        {
            if (header == firstRule.leftPart)
            {
                firstRow.set(header, 'OK');
            }

            for (const first of firstRuleFirsts)
            {
                if (header == first.symbol)
                {
                    if (this._isEpsilonSymbol(first.symbol))
                    {
                        let followingSymbols = this._computeFollowSet(first.symbol, new Set<string>());
                        for (const followSymbol of followingSymbols)
                        {
                            firstRow.set(followSymbol.symbol, "R" + this.rules[first.row].leftPart + "0");
                        }

                        continue;
                    }
                    let valueToInsert = first.toString();
                    if (firstRow.has(first.symbol))
                    {
                        this.mergedStates.set(first.toString(), firstRow.get(first.symbol))
                        valueToInsert = firstRow.get(first.symbol) + "+" + valueToInsert;
                    }
                    firstRow.set(header, valueToInsert);
                }
            }
        }

        table.set(firstRule.leftPart, firstRow);

        for (const rule of this.rules)
        {
            for (const part of rule.rightPart)
            {
                if (this._isEndSymbol(part.symbol) || this._isEpsilonSymbol(part.symbol))
                {
                    continue;
                }
                let newRow: Map<string, string> = new Map<string, string>();

                if (part == rule.rightPart[rule.rightPart.length - 1])
                {
                    let followingSymbols = this._computeFollowSet(part.symbol, new Set<string>());

                    for (const sym of followingSymbols)
                    {
                        newRow.set(sym.symbol, "R" + rule.leftPart + rule.rightPart.length);
                    }
                }
                else
                {
                    let followingSymbols = this._findFollowingSymbols(part.symbol);

                    for (const sym of followingSymbols)
                    {
                        if (this._isEndSymbol(sym.symbol))
                        {
                            newRow.set(sym.symbol, "R" + rule.leftPart + rule.rightPart.length);
                        }
                        else
                        {
                            if (this._isEpsilonSymbol(sym.symbol))
                            {
                                let followingSymbols = this._computeFollowSet(sym.symbol, new Set<string>());
                                for (const followSymbol of followingSymbols)
                                {
                                    firstRow.set(followSymbol.symbol, "R" + this.rules[sym.row].leftPart + "0");
                                }

                                continue;
                            }
                            let valueToInsert = sym.toString();
                            if (newRow.has(sym.symbol))
                            {
                                this.mergedStates.set(sym.toString(), newRow.get(sym.symbol))
                                valueToInsert = newRow.get(sym.symbol) + "+" + valueToInsert;
                            }
                            newRow.set(sym.symbol, valueToInsert);
                        }
                    }
                }

                table.set(part.toString(), newRow);
            }
        }
        for (const [key, value] of this.mergedStates.entries())
        {
            let newRow: Map<string, string> = new Map<string, string>();
            let firstOldRow = table.get(key);
            let secondOldRow = table.get(value);
            if (secondOldRow)
            {
                for (const [newKey, newValue] of secondOldRow)
                {
                    newRow.set(newKey, newValue);
                    if (firstOldRow.has(newKey))
                    {
                        newRow.set(newKey, firstOldRow.get(newKey));
                    }
                }
            }
            else
            {
                console.log("key: ", key, ", table[key]: ", table.get(key));
                console.log("value: ", value, ", table[value]: ", table.get(value));
                for (const [newKey, newValue] of firstOldRow)
                {
                    newRow.set(newKey, newValue);
                }
            }

            table.set(value + "+" + key, newRow);
        }

        for (const [key, value] of this.mergedStates.entries())
        {
            if (table.has(key))
            {
                table.delete(key);
            }
            if (table.has(value))
            {
                table.delete(value);
            }
        }

        return table;
    }

    private _isEpsilonSymbol(symbol: string): boolean
    {
        return symbol == "~ε~";
    }

    private _getColumnHeaders(): string[]
    {
        const uniqueHeaders = new Set<string>;

        for (const rule of this.rules)
        {
            uniqueHeaders.add(rule.leftPart);

            for (const symbol of rule.rightPart)
            {
                uniqueHeaders.add(symbol.symbol);
            }
        }

        return [...uniqueHeaders];
    }

    private _isTerminal(symbol: string): boolean
    {
        return symbol.startsWith('~');
    }

    private _isEndSymbol(symbol: string): boolean
    {
        return symbol == "~#~";
    }

    public _computeFirstSet(
        targetSymbolStr: string,
        visitedOnCurrentPath: Set<string>
    ): Symbol[]
    {
        const firstSymbolsAggregator: Map<string, Symbol> = new Map();

        if (this._isTerminal(targetSymbolStr))
        {
            const terminalSymbol = new Symbol(targetSymbolStr, -1, -1);
            if (!firstSymbolsAggregator.has(terminalSymbol.toString()))
            {
                firstSymbolsAggregator.set(terminalSymbol.toString(), terminalSymbol);
            }
            return Array.from(firstSymbolsAggregator.values());
        }

        if (visitedOnCurrentPath.has(targetSymbolStr))
        {
            return [];
        }
        visitedOnCurrentPath.add(targetSymbolStr);


        for (const rule of this.rules)
        {
            if (rule.leftPart === targetSymbolStr)
            {
                if (rule.rightPart.length > 0)
                {
                    const firstSymbolInRhs_obj = rule.rightPart[0];

                    if (!this._isTerminal(firstSymbolInRhs_obj.symbol))
                    {
                        if (!firstSymbolsAggregator.has(firstSymbolInRhs_obj.toString()))
                        {
                            firstSymbolsAggregator.set(firstSymbolInRhs_obj.toString(), firstSymbolInRhs_obj);
                        }
                    }

                    const firstsOf_X1 = this._computeFirstSet(
                        firstSymbolInRhs_obj.symbol,
                        visitedOnCurrentPath
                    );

                    for (const s of firstsOf_X1)
                    {
                        let symbolToAdd: Symbol;
                        if (s.row === -1 && s.position === -1 && s.symbol === firstSymbolInRhs_obj.symbol && this._isTerminal(firstSymbolInRhs_obj.symbol))
                        {
                            symbolToAdd = new Symbol(s.symbol, firstSymbolInRhs_obj.row, firstSymbolInRhs_obj.position);
                        }
                        else
                        {
                            symbolToAdd = s;
                        }

                        if (!firstSymbolsAggregator.has(symbolToAdd.toString()))
                        {
                            firstSymbolsAggregator.set(symbolToAdd.toString(), symbolToAdd);
                        }
                    }
                }
            }
        }

        visitedOnCurrentPath.delete(targetSymbolStr);
        return Array.from(firstSymbolsAggregator.values());
    }

    public _findFollowingSymbols(targetSymbolStr: string): Symbol[]
    {
        const finalResultsMap: Map<string, Symbol> = new Map();

        function addResult(s: Symbol)
        {
            if (!finalResultsMap.has(s.toString()))
            {
                finalResultsMap.set(s.toString(), s);
            }
        }

        for (const rule of this.rules)
        {
            for (let i = 0; i < rule.rightPart.length; i++)
            {
                const currentSymbolInRule = rule.rightPart[i];

                if (currentSymbolInRule.symbol === targetSymbolStr)
                {
                    if (i + 1 < rule.rightPart.length)
                    {
                        const directFollowerSymbolObj = rule.rightPart[i + 1];

                        addResult(directFollowerSymbolObj);

                        if (!this._isTerminal(directFollowerSymbolObj.symbol))
                        {
                            const firstSetOfDirectFollower = this._computeFirstSet(
                                directFollowerSymbolObj.symbol,
                                new Set<string>()
                            );
                            firstSetOfDirectFollower.forEach(s => addResult(s));
                        }
                    }
                }
            }
        }
        return Array.from(finalResultsMap.values());
    }

    public _computeFollowSet(
        ntSymbolString: string,
        visitedForFollowCycle: Set<string>
    ): Symbol[]
    {
        if (visitedForFollowCycle.has(ntSymbolString))
        {
            return [];
        }
        visitedForFollowCycle.add(ntSymbolString);

        const followAggregator: Map<string, Symbol> = new Map();

        if (this.rules.length > 0 && this.rules[0].leftPart === ntSymbolString)
        {
            const endMarker = new Symbol("~#~", -1, -1);
            if (!followAggregator.has(endMarker.toString()))
            {
                followAggregator.set(endMarker.toString(), endMarker);
            }
        }

        for (const ruleB of this.rules)
        {
            for (let i = 0; i < ruleB.rightPart.length; i++)
            {
                const symbolA_obj = ruleB.rightPart[i];

                if (symbolA_obj.symbol === ntSymbolString)
                {
                    if (i + 1 < ruleB.rightPart.length)
                    {
                        const betaPart = ruleB.rightPart.slice(i + 1);
                        let allBetaToEpsilon = false;

                        for (let j = 0; j < betaPart.length; j++)
                        {
                            const Xj_obj = betaPart[j];
                            const firstOfXj = this._computeFirstSet(Xj_obj.symbol, new Set<string>());

                            let currentXjCanBeEpsilon = false;
                            for (const firstSym of firstOfXj)
                            {
                                if (firstSym.symbol === "ε")
                                {
                                    currentXjCanBeEpsilon = true;
                                }
                                else
                                {
                                    const followSymbol = new Symbol(firstSym.symbol, ruleB.num, Xj_obj.position);
                                    if (!followAggregator.has(followSymbol.toString()))
                                    {
                                        followAggregator.set(followSymbol.toString(), followSymbol);
                                    }
                                }
                            }
                            if (!currentXjCanBeEpsilon)
                            {
                                allBetaToEpsilon = false;
                                break;
                            }
                            if (j === betaPart.length - 1)
                            {
                                allBetaToEpsilon = true;
                            }
                        }

                        if (allBetaToEpsilon)
                        {
                            if (ruleB.leftPart !== ntSymbolString)
                            {
                                const followOfLhsB = this._computeFollowSet(ruleB.leftPart, visitedForFollowCycle);
                                followOfLhsB.forEach(s =>
                                {
                                    if (!followAggregator.has(s.toString()))
                                    {
                                        followAggregator.set(s.toString(), s);
                                    }
                                });
                            }
                        }
                    }
                    else
                    {
                        if (ruleB.leftPart !== ntSymbolString)
                        {
                            const followOfLhsB = this._computeFollowSet(ruleB.leftPart, visitedForFollowCycle);
                            followOfLhsB.forEach(s =>
                            {
                                if (!followAggregator.has(s.toString()))
                                {
                                    followAggregator.set(s.toString(), s);
                                }
                            });
                        }
                    }
                }
            }
        }

        visitedForFollowCycle.delete(ntSymbolString);
        return Array.from(followAggregator.values());
    }

    public mapToObject(map: Map<string, Map<string, string>>): Record<string, Record<string, string>>
    {
        const obj: Record<string, Record<string, string>> = {};
        for (const [key, innerMap] of map.entries())
        {
            obj[key] = Object.fromEntries(innerMap.entries());
        }
        return obj;
    }
}

export {GrammarRule, TableGenerator, GrammarParser};