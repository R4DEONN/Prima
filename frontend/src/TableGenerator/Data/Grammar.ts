export interface GrammarRow
{
    leftNonTerminal: string;
    rightParts: string[];
    guideSymbols: string[];
}

export type Grammar = GrammarRow[];