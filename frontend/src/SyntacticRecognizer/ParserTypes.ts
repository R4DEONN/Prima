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

export type InputParserTable = TableRow[];

export type ParserTableMap = Map<number, TableRow>;

export interface IParserErrorReporter
{
    report(line: number | null, pos: number | null, message: string): void;

    hadError: boolean;
}

export class ConsoleParserErrorReporter implements IParserErrorReporter
{
    public hadError = false;

    report(line: number | null, pos: number | null, message: string): void
    {
        this.hadError = true;
        let prefix = "Error";
        if (line !== null)
        {
            prefix = `[Line ${line}${pos !== null ? `, Pos ${pos}` : ''}] Error`;
        }
        console.error(`${prefix}: ${message}`);
    }
}