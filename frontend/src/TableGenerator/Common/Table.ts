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
}

export type Table = TableRow[];