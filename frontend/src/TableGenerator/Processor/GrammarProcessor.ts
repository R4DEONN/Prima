import * as fs from 'fs';
import {Grammar} from '../Data/Grammar';
import {Table} from '../Common/Table';
import {GrammarParser} from '../Parser/GrammarParser';
import {TableGenerator} from '../Generator/TableGenerator';
import {TableExporter} from '../Utils/TableExporter';

export class GrammarProcessor
{
    private grammar: Grammar;
    private table: Table | null;

    constructor(private inputFileName: string)
    {
        this.grammar = [];
        this.table = null;
        this.parseInputFile(this.inputFileName);
    }

    private parseInputFile(fileName: string): void
    {
        try
        {
            const fileContent = fs.readFileSync(fileName, 'utf-8');
            const lines = fileContent.split(/\r?\n/);

            for (const line of lines)
            {
                if (line.trim() === '')
                {
                    continue;
                }
                const parsedRow = GrammarParser.parseLine(line);
                if (parsedRow)
                {
                    this.grammar.push(parsedRow);
                }
                else
                {
                    console.warn(`Warning: Line could not be parsed and was skipped: "${line}"`);
                }
            }
        }
        catch (error)
        {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`Input file "${fileName}" could not be opened or read: ${message}`);
        }
    }

    public processGrammar(): void
    {
        if (this.grammar.length === 0)
        {
            console.warn("Grammar is empty. Processing will result in an empty or null table.");
            this.table = [];
            return;
        }
        const generator = new TableGenerator(this.grammar);
        this.table = generator.generate();
    }

    public exportTable(outputFileName: string): void
    {
        if (this.table === null)
        {
            console.warn("Table is null, possibly because grammar was empty or not processed. Exporting empty table.");
            TableExporter.exportToJSON([], outputFileName);
            return;
        }
        TableExporter.exportToJSON(this.table, outputFileName);
    }
}