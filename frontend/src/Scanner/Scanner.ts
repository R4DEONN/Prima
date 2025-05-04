import {Token} from "../Lexer/Token";

class Scanner {
    private _tokens: Array<Token>;
    private start = 0;
    private current = 0;
    private line = 1;

    constructor(
        private _source: string,
    ) {
    }

    scanTokens(): Array<Token> {

    }

    private isAtEnd() {
    }
}

export {Scanner};