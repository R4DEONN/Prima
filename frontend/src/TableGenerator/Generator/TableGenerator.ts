import {Grammar, GrammarRow} from '../Data/Grammar';
import {Table, TableRow} from '../Common/Table';
import {
    isNonTerminal,
    isEmptySymbol,
    isEnd,
    findGuidingSymbolsInGrammarForNonTerminal,
    findFirstRuleNumber
} from '../Utils/Utils';

export class TableGenerator
{
    private readonly grammar: Grammar;
    private table: Table;
    private currentRowNumber: number;

    constructor(grammar: Grammar)
    {
        this.grammar = grammar;
        this.table = [];
        this.currentRowNumber = 0;
    }

    public generate(): Table
    {
        this.initializeTableFromGrammar();
        this.setInitialPointers();
        this.processGrammarRules();
        return this.table;
    }

    private initializeTableFromGrammar(): void
    {
        for (const grammarRow of this.grammar)
        {
            this.currentRowNumber++;
            const newRow: TableRow = {
                number: this.currentRowNumber,
                nonTerminal: grammarRow.leftNonTerminal,
                guidingSymbols: [...grammarRow.guideSymbols],
                isShift: false,
                isError: true,
                pointer: null,
                isStack: false,
                isEnd: false,
            };
            this.table.push(newRow);

            if (this.currentRowNumber > 1 &&
                this.table[this.currentRowNumber - 2].nonTerminal === grammarRow.leftNonTerminal)
            {
                this.table[this.currentRowNumber - 2].isError = false;
            }
        }
    }

    private setInitialPointers(): void
    {
        if (this.table.length > 0)
        {
            this.table[0].pointer = this.grammar.length + 1;
        }

        for (let i = 1; i < this.grammar.length; i++)
        {
            if (this.table[i])
            {
                this.table[i].pointer = this.grammar.length + this.calculatePredictedNumber(i);
            }
        }
    }

    private calculatePredictedNumber(currentIndex: number): number
    {
        let predictedNumber = 1;
        for (let ruleIndex = 0; ruleIndex < currentIndex; ruleIndex++)
        {
            if (this.grammar[ruleIndex])
            {
                predictedNumber += this.grammar[ruleIndex].rightParts.length;
            }
        }
        return predictedNumber;
    }


    private processGrammarRules(): void
    {
        for (const grammarRow of this.grammar)
        {
            this.generateTableRowsForRule(grammarRow);
        }
    }

    private generateTableRowsForRule(rule: GrammarRow): void
    {
        for (let i = 0; i < rule.rightParts.length; i++)
        {
            this.currentRowNumber++;
            const symbol = rule.rightParts[i];
            const isLastSymbolInRule = (i === rule.rightParts.length - 1);
            this.generateTableRowForSymbol(symbol, isLastSymbolInRule, rule.guideSymbols);
        }
    }

    private generateTableRowForSymbol(symbol: string, isLastSymbolInRule: boolean, guideSymbolsFromRule: string[]): void
    {
        const row: TableRow = {
            number: this.currentRowNumber,
            nonTerminal: symbol,
            guidingSymbols: [],
            isShift: false,
            isError: true,
            pointer: null,
            isStack: false,
            isEnd: false,
        };

        TableGenerator.applyInitializeTableRowLogic(row, symbol);
        this.applySetPointerForSymbol(row, symbol, isLastSymbolInRule);
        TableGenerator.applySetStackFlagLogic(row, symbol, isLastSymbolInRule);
        this.applySetGuidingSymbols(row, symbol, guideSymbolsFromRule);
        TableGenerator.applyHandleEndSymbolLogic(row, symbol);

        this.table.push(row);
    }

    private static applyInitializeTableRowLogic(row: TableRow, symbol: string): void
    {
        row.isShift = !isNonTerminal(symbol) && !isEmptySymbol(symbol);
    }

    private applySetPointerForSymbol(row: TableRow, symbol: string, isLastSymbolInRule: boolean): void
    {
        if (isNonTerminal(symbol))
        {
            row.pointer = findFirstRuleNumber(symbol, this.grammar);
        }
        else
        {
            row.pointer = !isLastSymbolInRule ? (this.currentRowNumber + 1) : null;
        }
    }

    private static applySetStackFlagLogic(row: TableRow, symbol: string, isLastSymbolInRule: boolean): void
    {
        row.isStack = isNonTerminal(symbol) && !isLastSymbolInRule;
    }

    private applySetGuidingSymbols(row: TableRow, symbol: string, guideSymbolsFromRule: string[]): void
    {
        if (!isNonTerminal(symbol) && !isEmptySymbol(symbol))
        {
            row.guidingSymbols.push(symbol);
        }
        else
        {
            let guidingSymbolsToAdd: string[];
            if (isEmptySymbol(symbol))
            {
                guidingSymbolsToAdd = [...guideSymbolsFromRule];
            }
            else
            {
                guidingSymbolsToAdd = findGuidingSymbolsInGrammarForNonTerminal(this.grammar, symbol);
            }
            row.guidingSymbols.push(...guidingSymbolsToAdd);
        }
    }

    private static applyHandleEndSymbolLogic(row: TableRow, symbol: string): void
    {
        if (isEnd(symbol))
        {
            row.pointer = null;
            row.isEnd = true;
        }
    }
}