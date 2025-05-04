import {TokenType} from "./TokenType";

class Token {
    constructor(
        private readonly _type: TokenType,
        private readonly _lexeme: string,
        private readonly _line: number,
        private readonly _pos: number,
    ) {
    }

    getType() {
        return this._type;
    }

    getLexeme() {
        return this._lexeme;
    }

    getLine() {
        return this._line;
    }

    getPos() {
        return this._pos;
    }

    toString() {
        return `At line ${this._line} and pos ${this._pos}: ${this._type} (${this._lexeme})`;
    }
}

export {Token};