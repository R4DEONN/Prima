export interface TableRow
{
    number: number;
    nonTerminal: string;
    guidingSymbols: string[];
    isShift: boolean;
    isError: boolean;
    pointer: number | null;
    isStack: boolean;
    isEnd: boolean;
    action?: string;
}

export type Table = TableRow[];