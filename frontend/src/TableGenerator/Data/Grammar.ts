export interface GrammarRow
{
    leftNonTerminal: string;
    rightParts: string[];
    guideSymbols: string[];
    action?: string;
}

export type Grammar = GrammarRow[];