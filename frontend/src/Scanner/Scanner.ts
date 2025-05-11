import {Token} from "../Common/Token";
import {TokenType} from "../Common/TokenType";
import {IErrorReporter} from "../Error/ErrorReporter/IErrorReporter";
import {KEYWORDS} from "../Common/Keywords";

class Scanner
{
    private _tokens: Array<Token> = [];
    private _start = 0;
    private _current = 0;
    private _line = 1;
    private _pos = 1;

    constructor(
        private _source: string,
        private _errorReporter: IErrorReporter,
    )
    {
    }

    public scanTokens(): Array<Token>
    {
        while (!this._isAtEnd())
        {
            this._start = this._current;
            this._scanToken();
        }

        this._tokens.push(new Token(TokenType.EOF, "", null, this._line));
        return this._tokens;
    }

    private _isAtEnd(): boolean
    {
        return this._current >= this._source.length;
    }

    private _scanToken()
    {
        const char = this._advance();
        switch (char)
        {
            case '(':
                this._addToken(TokenType.LEFT_PAREN);
                break;
            case ')':
                this._addToken(TokenType.RIGHT_PAREN);
                break;
            case '{':
                this._addToken(TokenType.LEFT_BRACE);
                break;
            case '}':
                this._addToken(TokenType.RIGHT_BRACE);
                break;
            case ',':
                this._addToken(TokenType.COMMA);
                break;
            case '.':
                this._addToken(TokenType.DOT);
                break;
            case '-':
                if (this._match('-'))
                {
                    this._addToken(TokenType.MINUS_MINUS);
                }
                else if (this._match('='))
                {
                    this._addToken(TokenType.MINUS_EQUAL);
                }
                else
                {
                    this._addToken(TokenType.MINUS);
                }
                break;
            case '+':
                if (this._match('+'))
                {
                    this._addToken(TokenType.PLUS_PLUS);
                }
                else if (this._match('='))
                {
                    this._addToken(TokenType.PLUS_EQUAL);
                }
                else
                {
                    this._addToken(TokenType.PLUS);
                }
                break;
            case ';':
                this._addToken(TokenType.SEMICOLON);
                break;
            case ':':
                this._addToken(TokenType.COLON);
                break;
            case '%':
                this._addToken(TokenType.PERCENT);
                break;
            case '*':
                this._addToken(this._match('*') ? TokenType.STAR_STAR : TokenType.STAR);
                break;
            case '!':
                this._addToken(this._match('=') ? TokenType.BANG_EQUAL : TokenType.BANG);
                break;
            case '=':
                this._addToken(this._match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);
                break;
            case '<':
                this._addToken(this._match('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
                break;
            case '>':
                this._addToken(this._match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER);
                break;
            case '/':
                if (this._match('/'))
                {
                    while (this._peek() != '\n' && !this._isAtEnd())
                    {
                        this._advance();
                    }
                }
                else
                {
                    this._addToken(TokenType.SLASH);
                }
                break;
            case '|':
                if (this._match('|'))
                {
                    this._addToken(TokenType.OR);
                }
                else
                {
                    this._report(char);
                }
                break;

            case '&':
                if (this._match('&'))
                {
                    this._addToken(TokenType.AND);
                }
                else
                {
                    this._report(char);
                }
                break;

            case ' ':
            case '\r':
            case '\t':
                // Игнорируем пробелы
                break;

            case '\n':
                this._line++;
                this._pos = 1;
                break;

            case '"':
                this._scanString();
                break;


            default:
                if (this._isDigit(char))
                {
                    this._scanNumber();
                }
                else if (this._isAlpha(char))
                {
                    this._scanIdentifier();
                }
                else
                {
                    this._report(char);
                }
                break;
        }
    }

    private _advance(): string
    {
        this._pos++;
        return this._source.charAt(this._current++);
    }

    private _peek(): string
    {
        if (this._isAtEnd())
        {
            return '\0';
        }

        return this._source.charAt(this._current);
    }

    private _peekNext(): string
    {
        if (this._current + 1 >= this._source.length)
        {
            return '\0';
        }
        return this._source.charAt(this._current + 1);
    }

    private _addToken(type: TokenType,): void
    {
        const text = this._source.substring(this._start, this._current);
        this._tokens.push(new Token(type, text, this._line, this._pos));
    }

    private _match(expected: string): boolean
    {
        if (this._isAtEnd())
        {
            return false;
        }

        if (this._source.charAt(this._current) != expected)
        {
            return false;
        }

        this._current++;
        this._pos++;
        return true;
    }

    private _scanString(): void
    {
        while (this._peek() != '"' && !this._isAtEnd())
        {
            if (this._peek() == '\n')
            {
                this._line++;
                this._pos = 1;
            }
            this._advance();
        }

        if (this._isAtEnd())
        {
            this._errorReporter.report(this._line, this._pos, "Unterminated string.");
            return;
        }

        this._advance();
        this._addToken(TokenType.STRING);
    }

    private _isDigit(char: string): boolean
    {
        return char >= '0' && char <= '9';
    }

    private _scanNumber(): void
    {
        const advanceWhileDigit = () =>
        {
            while (this._isDigit(this._peek()))
            {
                this._advance();
            }
        }

        advanceWhileDigit();

        if (this._peek() == '.' && this._isDigit(this._peekNext()))
        {
            this._advance();
            advanceWhileDigit();
        }

        this._addToken(TokenType.NUMBER);
    }

    private _scanIdentifier(): void
    {
        while (this._isAlphaNumeric(this._peek()))
        {
            this._advance();
        }

        const text: string = this._source.substring(this._start, this._current);
        const type = KEYWORDS[text];
        this._addToken(type ?? TokenType.IDENTIFIER);
    }

    private _isAlpha(c: string): boolean
    {
        return (c >= 'a' && c <= 'z')
            || (c >= 'A' && c <= 'Z')
            || c == '_';
    }

    private _isAlphaNumeric(c: string): boolean
    {
        return this._isAlpha(c) || this._isDigit(c);
    }

    private _report(char: string)
    {
        this._errorReporter.report(this._line, this._pos, `Unexpected character ${char}`);
    }
}

export {Scanner};