import {Token} from "../Common/Token";
import {TokenType} from "../Common/TokenType";
import {
    ConsoleParserErrorReporter,
    InputParserTable,
    IParserErrorReporter,
    ParserTableMap,
    TableRow
} from "./ParserTypes";
import * as fs from 'fs';
import {TYPE_TO_TERMINAL} from "../Common/TypeToTerminal";
import {ASTNode} from "../AST/Nodes/ASTNode";
import {actionHandlers} from "./ActionHandlers";
import {tokenToAstNode} from "./tokenToAstNode";

export class SyntacticRecognizer
{
    private m_table: ParserTableMap;
    private m_tokens: Token[];
    private m_stack: number[] = [];
    private m_currentState: number = 1;
    private m_currentTokenIndex: number = 0;
    private errorReporter: IParserErrorReporter;
    private tableLoadedSuccessfully: boolean = false;
    private astStack: ASTNode[] = [];

    constructor(
        tableFilePath: string,
        tokens: Token[],
        errorReporter?: IParserErrorReporter
    )
    {
        this.m_tokens = tokens;
        this.errorReporter = errorReporter || new ConsoleParserErrorReporter();
        this.m_table = new Map<number, TableRow>();

        try
        {
            const fileContent = fs.readFileSync(tableFilePath, 'utf-8');
            const tableArray: InputParserTable = JSON.parse(fileContent);

            for (const row of tableArray)
            {
                if (this.m_table.has(row.number)) continue;
                this.m_table.set(row.number, row);
            }

            if (this.m_table.has(this.m_currentState))
            {
                this.tableLoadedSuccessfully = true;
            }
        }
        catch (e: any)
        {
            this.errorReporter.report(null, null, `Ошибка загрузки таблицы: ${e.message}`);
        }
    }

    public parse(): ASTNode | null
    {
        if (!this.tableLoadedSuccessfully || this.errorReporter.hadError) return null;

        while (this.m_currentState > 0 && !this.errorReporter.hadError)
        {
            if (this.m_currentTokenIndex >= this.m_tokens.length) break;

            const currentToken = this.m_tokens[this.m_currentTokenIndex];
            const isEndState = this.isEnd(this.m_currentState);
            const row = this.m_table.get(this.m_currentState);

            if (currentToken.getType() === TokenType.EOF && isEndState)
            {
                if (row?.action)
                {
                    const handler = actionHandlers[row.action];
                    if (!handler)
                    {
                        this.errorReporter.report(null, null, `Нет обработчика действия: ${row.action}`);
                        return null;
                    }
                    try
                    {
                        const node = handler(this.astStack);
                        this.astStack.push(node);
                    }
                    catch (e: any)
                    {
                        this.errorReporter.report(null, null, `Ошибка в handler '${row.action}': ${e.message}`);
                        return null;
                    }
                }

                return this.astStack.length > 0 ? this.astStack.pop()! : null;
            }

            if (!this.processState()) return null;
        }

        return null;
    }

    private processState(): boolean
    {
        if (!this.m_table.has(this.m_currentState)) return false;

        const row = this.m_table.get(this.m_currentState)!;

        if (this.m_currentTokenIndex >= this.m_tokens.length && !row.isEnd) return false;

        const currentToken = this.m_tokens[this.m_currentTokenIndex];
        const currentSymbol = TYPE_TO_TERMINAL[currentToken.getType()];

        const isSymbolValid = this.isCurrentSymbolInGuidingSymbols(row, currentSymbol);

        if (row.isError && !isSymbolValid)
        {
            this.errorReporter.report(
                currentToken.getLine(),
                currentToken.getPos(),
                `Ожидался один из: ${row.guidingSymbols.join(', ')}, но получен: ${currentSymbol}`
            );
            return false;
        }

        if (isSymbolValid)
        {
            if (row.isShift)
            {
                const token = this.m_tokens[this.m_currentTokenIndex];
                const node = tokenToAstNode(token);

                if (node)
                {
                    this.astStack.push(node);
                }

                this.m_currentTokenIndex++;
            }

            this.handlePointerAndStack(row);

            if (row.action)
            {
                const handler = actionHandlers[row.action];
                if (!handler)
                {
                    this.errorReporter.report(null, null, `Нет обработчика действия: ${row.action}`);
                    return false;
                }
                try
                {
                    const node = handler(this.astStack);
                    this.astStack.push(node);
                }
                catch (e: any)
                {
                    this.errorReporter.report(null, null, `Ошибка в handler '${row.action}': ${e.message}`);
                    return false;
                }
            }

        }
        else
        {
            this.m_currentState++;
            if (!this.m_table.has(this.m_currentState) && !row.isEnd)
            {
                this.errorReporter.report(
                    currentToken.getLine(),
                    currentToken.getPos(),
                    `Альтернативное правило не найдено для символа ${currentSymbol}`
                );
                return false;
            }
        }

        return true;
    }

    private handlePointerAndStack(row: TableRow): void
    {
        const previous = this.m_currentState;

        if (row.pointer !== null)
        {
            if (row.pointer > 0)
            {
                this.m_currentState = row.pointer;
            }
        }
        else
        {
            if (this.m_stack.length > 0)
            {
                this.m_currentState = this.m_stack.pop()!;
            }
            else
            {
                this.errorReporter.report(null, null, `Пустой стек при null указателе в состоянии ${this.m_currentState}`);
                this.m_currentState = 0;
            }
        }

        if (row.isStack)
        {
            this.m_stack.push(previous + 1);
        }
    }

    private isCurrentSymbolInGuidingSymbols(row: TableRow, currentSymbol: string): boolean
    {
        return row.guidingSymbols.includes(currentSymbol);
    }

    private isEnd(stateNumber: number): boolean
    {
        return this.m_table.has(stateNumber) && this.m_table.get(stateNumber)!.isEnd;
    }
}
