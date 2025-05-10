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

export class SyntacticRecognizer
{
    private m_table: ParserTableMap;
    private m_tokens: Token[];
    private m_stack: number[] = [];
    private m_currentState: number = 1;
    private m_currentTokenIndex: number = 0;
    private errorReporter: IParserErrorReporter;
    private tableLoadedSuccessfully: boolean = false;

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

            if (!Array.isArray(tableArray))
            {
                this.errorReporter.report(null, null, `Файл таблицы парсинга "${tableFilePath}" не содержит массив.`);
                return;
            }

            for (const row of tableArray)
            {
                if (this.m_table.has(row.number))
                {
                    this.errorReporter.report(
                        null,
                        null,
                        `Обнаружен дубликат номера состояния ${row.number} в таблице парсинга из файла "${tableFilePath}".`
                    );
                    continue;
                }
                if (typeof row.number !== 'number' ||
                    typeof row.nonTerminal !== 'string' ||
                    !Array.isArray(row.guidingSymbols) ||
                    typeof row.isShift !== 'boolean' ||
                    typeof row.isError !== 'boolean' ||
                    (typeof row.pointer !== 'number' && row.pointer !== null) ||
                    typeof row.isStack !== 'boolean' ||
                    typeof row.isEnd !== 'boolean')
                {
                    this.errorReporter.report(null, null, `Некорректная структура для TableRow с номером ${row.number || 'unknown'} в файле "${tableFilePath}".`);
                    continue;
                }
                this.m_table.set(row.number, row);
            }

            if (tableArray.length === 0 && !this.errorReporter.hadError)
            {
                this.errorReporter.report(null, null, `Таблица парсинга, загруженная из "${tableFilePath}", пуста.`);
                return;
            }

            if (!this.m_table.has(this.m_currentState) && this.m_table.size > 0)
            {
                this.errorReporter.report(null, null, `Начальное состояние ${this.m_currentState} не найдено в таблице парсинга из файла "${tableFilePath}".`);
                return;
            }

            if (!this.errorReporter.hadError && this.m_table.size > 0)
            {
                this.tableLoadedSuccessfully = true;
            }
            else if (this.m_table.size === 0 && !this.errorReporter.hadError)
            {
                this.errorReporter.report(null, null, `Таблица парсинга из файла "${tableFilePath}" пуста или не содержит валидных состояний.`);
            }

        }
        catch (e: any)
        {
            this.errorReporter.report(null, null, `Не удалось загрузить или разобрать таблицу из "${tableFilePath}": ${e.message}`);
        }
    }

    public parse(): boolean
    {
        if (!this.tableLoadedSuccessfully)
        {
            if (!this.errorReporter.hadError)
            {
                this.errorReporter.report(null, null, "Парсинг не может быть запущен: таблица парсинга не была успешно загружена.");
            }
            this.printTrace("Парсинг прерван из-за ошибок при загрузке таблицы или инициализации.");
            return false;
        }
        if (this.errorReporter.hadError)
        {
            this.printTrace("Парсинг прерван из-за ошибок инициализации.");
            return false;
        }


        while (this.m_currentState > 0 && !this.errorReporter.hadError)
        {
            if (this.m_currentTokenIndex >= this.m_tokens.length)
            {
                break;
            }

            const currentToken = this.m_tokens[this.m_currentTokenIndex];
            if (currentToken.getType() === TokenType.EOF && this.isEnd(this.m_currentState))
            {
                this.printTrace(`Обработка токена EOF. Текущее состояние ${this.m_currentState} является конечным.`);
                break;
            }
            if (currentToken.getType() === TokenType.EOF && !this.isEnd(this.m_currentState))
            {
                this.printTrace(`Обработка токена EOF. Текущее состояние ${this.m_currentState} НЕ является конечным.`);
            }


            this.printTrace(`Обработка состояния: ${this.m_currentState}, Индекс токена: ${this.m_currentTokenIndex}`);

            if (!this.processState(this.m_currentState))
            {
                return false;
            }

            if (this.isEnd(this.m_currentState))
            {
                this.printTrace(`Достигнут конец разбора в состоянии ${this.m_currentState}.`);

                let remainingSignificantTokens = false;
                for (let i = this.m_currentTokenIndex; i < this.m_tokens.length; i++)
                {
                    if (this.m_tokens[i].getType() !== TokenType.EOF)
                    {
                        remainingSignificantTokens = true;
                        break;
                    }
                }

                if (remainingSignificantTokens)
                {
                    const nextToken = this.m_tokens[this.m_currentTokenIndex];
                    this.errorReporter.report(
                        nextToken.getLine(),
                        nextToken.getPos(),
                        `Разбор завершен в состоянии ${this.m_currentState}, но остались необработанные токены, начиная с: '${nextToken.getLexeme()}' (${nextToken.getType()}).`
                    );
                    return false;
                }
                return true;
            }

            if (this.m_currentState <= 0 && !this.errorReporter.hadError)
            {
                this.errorReporter.report(null, null, `Недопустимый переход состояния или операция со стеком привели к состоянию ${this.m_currentState}.`);
                return false;
            }
        }

        if (this.errorReporter.hadError)
        {
            this.printTrace("Разбор не удался из-за зарегистрированных ошибок.");
            return false;
        }

        if (this.m_currentState <= 0)
        {
            this.errorReporter.report(null, null, `Разбор завершился в недопустимом состоянии: ${this.m_currentState}.`);
            return false;
        }

        if (this.isEnd(this.m_currentState))
        {
            if (this.m_currentTokenIndex < this.m_tokens.length &&
                this.m_tokens[this.m_currentTokenIndex].getType() !== TokenType.EOF)
            {
                const token = this.m_tokens[this.m_currentTokenIndex];
                this.errorReporter.report(token.getLine(), token.getPos(), `Входные данные закончились преждевременно. Ожидался EOF, но разбор завершился. Текущий токен: ${token.getLexeme()}`);
                return false;
            }
            this.printTrace("Конец разбора достигнут после обработки всех токенов.");
            return true;
        }

        const lastProcessedToken = this.m_currentTokenIndex > 0 ? this.m_tokens[this.m_currentTokenIndex - 1] : null;
        const line = lastProcessedToken?.getLine() ?? (this.m_tokens.length > 0 ? this.m_tokens[0].getLine() : 1);
        const pos = lastProcessedToken?.getPos() ?? (this.m_tokens.length > 0 ? this.m_tokens[0].getPos() : 1);

        let currentTokenInfo = "конец входных данных";
        if (this.m_currentTokenIndex < this.m_tokens.length)
        {
            const tok = this.m_tokens[this.m_currentTokenIndex];
            currentTokenInfo = `'${tok.getLexeme()}' (${tok.getType()}) на строке ${tok.getLine()}`;
        }

        this.errorReporter.report(line, pos, `Неожиданный конец разбора. Не в конечном состоянии (текущее состояние: ${this.m_currentState}). Текущий токен: ${currentTokenInfo}.`);
        return false;
    }

    private processState(currentState: number): boolean
    {
        if (this.isStateNotFound(currentState))
        {
            const token = this.m_currentTokenIndex < this.m_tokens.length ? this.m_tokens[this.m_currentTokenIndex] : null;
            this.errorReporter.report(
                token?.getLine() ?? null,
                token?.getPos() ?? null,
                `Недопустимое состояние ${currentState}. Состояние не найдено в таблице.`
            );
            return false;
        }

        const row = this.m_table.get(currentState)!;

        if (this.m_currentTokenIndex >= this.m_tokens.length)
        {
            if (!row.isEnd)
            {
                this.errorReporter.report(null, null, `Неожиданный конец входных данных в состоянии ${currentState} ('${row.nonTerminal}'). Ожидались еще токены.`);
                return false;
            }
            else
            {
                this.printTrace(`Достигнут конец входных токенов в состоянии ${currentState}, которое является конечным.`);
                return true;
            }
        }

        const currentToken = this.m_tokens[this.m_currentTokenIndex];
        const currentSymbol = TYPE_TO_TERMINAL[currentToken.getType()];

        this.printTrace(`Текущее состояние: ${row.number} ('${row.nonTerminal}'), Токен: '${currentSymbol}' (${currentToken.getType()}), Индекс: ${this.m_currentTokenIndex}`);

        const isSymbolValid = this.isCurrentSymbolInGuidingSymbols(row, currentSymbol);

        if (row.isError && !isSymbolValid)
        {
            const expected = row.guidingSymbols.join("', '") || "определенная последовательность согласно грамматике";
            this.errorReporter.report(
                currentToken.getLine(),
                currentToken.getPos(),
                `Неожиданный символ '${currentSymbol}' (${currentToken.getType()}). В состоянии ${row.number} ('${row.nonTerminal}'), ожидался один из: '${expected}'.`
            );
            return false;
        }

        if (isSymbolValid)
        {
            if (row.isShift)
            {
                if (!this.handleShift())
                {
                    return false;
                }
            }
            this.handlePointerAndStack(row, currentState);
        }
        else
        {
            this.m_currentState = currentState + 1;
            this.printTrace(`Символ '${currentSymbol}' не в направляющих символах для состояния ${currentState} ('${row.nonTerminal}'). Попытка следующего правила/состояния: ${this.m_currentState}`);
            if (this.isStateNotFound(this.m_currentState) && !this.isEnd(currentState))
            {
                this.errorReporter.report(
                    currentToken.getLine(),
                    currentToken.getPos(),
                    `Альтернативное правило не найдено после состояния ${currentState} ('${row.nonTerminal}') для символа '${currentSymbol}'. Следующее состояние ${this.m_currentState} недопустимо.`
                );
                return false;
            }
        }
        return true;
    }

    private handleShift(): boolean
    {
        if (this.m_currentTokenIndex >= this.m_tokens.length)
        {
            this.errorReporter.report(null, null, "Попытка сдвига за пределы входных данных.");
            return false;
        }

        const currentToken = this.m_tokens[this.m_currentTokenIndex];
        if (currentToken.getType() === TokenType.EOF)
        {
            this.printTrace(`Сдвиг: токен EOF. Это должно быть обработано isEnd или направляющими символами.`);
        }
        else
        {
            this.printTrace(`Сдвиг: '${currentToken.getLexeme()}'`);
        }

        this.m_currentTokenIndex++;
        return true;
    }

    private handlePointerAndStack(row: TableRow, currentStateNumber: number): void
    {
        let previousStateForStack = this.m_currentState;

        if (row.pointer !== null)
        {
            if (row.pointer > 0)
            {
                this.m_currentState = row.pointer;
                this.printTrace(`Указатель: Переход в состояние ${this.m_currentState}`);
            }
            else if (row.pointer <= 0)
            {
                this.printTrace(`Указатель: Значение ${row.pointer}. Нет изменения состояния по указателю, текущее состояние остается ${this.m_currentState}.`);
            }
        }
        else
        {
            if (this.m_stack.length > 0)
            {
                this.m_currentState = this.m_stack.pop()!;
                this.printTrace(`Указатель: Извлечение из стека (был null). Переход в состояние ${this.m_currentState}`);
            }
            else
            {
                this.errorReporter.report(null, null, `Указатель: Попытка извлечения из пустого стека в состоянии ${currentStateNumber} ('${row.nonTerminal}') т.к. указатель был null.`);
                this.m_currentState = 0;
            }
        }

        if (row.isStack)
        {
            this.m_stack.push(previousStateForStack + 1);
            this.printTrace(`Стек: Помещено ${previousStateForStack + 1}. Размер стека: ${this.m_stack.length}`);
        }
    }

    private printTrace(message: string): void
    {
        console.log(`ParserTrace: ${message}`);
    }

    private isStateNotFound(stateNumber: number): boolean
    {
        return !this.m_table.has(stateNumber);
    }

    private isCurrentSymbolInGuidingSymbols(row: TableRow, currentSymbol: string): boolean
    {
        return row.guidingSymbols.includes(currentSymbol);
    }

    private isEnd(stateNumber: number): boolean
    {
        if (this.isStateNotFound(stateNumber) || stateNumber <= 0) return false;
        return this.m_table.get(stateNumber)!.isEnd;
    }
}