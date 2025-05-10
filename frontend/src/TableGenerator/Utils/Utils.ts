import {Grammar} from '../Data/Grammar';

export function implode(elements: string[], delimiter: string): string
{
    return elements.join(delimiter);
}

export function isNonTerminal(token: string): boolean
{
    return token.length >= 2 && token.startsWith('<') && token.endsWith('>');
}

export function isEmptySymbol(token: string): boolean
{
    return token === "~ε~";
}

export function isEnd(token: string): boolean
{
    return token === "~#~";
}

export function findGuidingSymbolsInGrammarForNonTerminal(grammar: Grammar, token: string): string[]
{
    if (!isNonTerminal(token))
    {
        return [];
    }

    return grammar
        .filter(row => token === row.leftNonTerminal)
        .flatMap(row => row.guideSymbols);
}

export function findFirstRuleNumber(nonTerminal: string, grammar: Grammar): number
{
    for (let i = 0; i < grammar.length; i++)
    {
        if (nonTerminal === grammar[i].leftNonTerminal)
        {
            return i + 1;
        }
    }
    return 0;
}