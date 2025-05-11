import * as fs from 'fs';
import {Table} from '../Common/Table';

export class TableExporter
{
    public static exportToJSON(table: Table, fileName: string): void
    {
        try
        {
            const transformedTable = table.map(row => ({
                number: row.number,
                nonTerminal: row.nonTerminal,
                guidingSymbols: row.guidingSymbols,
                isShift: row.isShift,
                isError: row.isError,
                pointer: row.pointer,
                isStack: row.isStack,
                isEnd: row.isEnd,
            }));

            const jsonData = JSON.stringify(transformedTable, null, 2);
            fs.writeFileSync(fileName, jsonData, 'utf-8');
            console.log(`Table successfully exported to JSON file: ${fileName}`);
        }
        catch (error)
        {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`Could not write JSON to file "${fileName}": ${message}`);
        }
    }
}