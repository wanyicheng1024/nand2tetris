const KEYWORKD = 'keyword'
const SYMBOL = 'symbol'
const IDENTIFIER = 'identifier'
const INTCONTANT = 'integerConstant'
const STRINGCONTANT = 'stringConstant'

const symbolMap = {
    '{': 1,
    '}': 1,
    '(': 1,
    ')': 1,
    '[': 1,
    ']': 1,
    '.': 1,
    ',': 1,
    ';': 1,
    '+': 1,
    '-': 1,
    '*': 1,
    '/': 1,
    '&': 1,
    '|': 1,
    '<': 1,
    '>': 1,
    '=': 1,
    '~': 1,
}

const enCodeMap = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
}

const integerMap = {
    '0': 1,
    '1': 1,
    '2': 1,
    '3': 1,
    '4': 1,
    '5': 1,
    '6': 1,
    '7': 1,
    '8': 1,
    '9': 1,
}

const keywordMap = {
    'class': 1,
    'constructor': 1,
    'function': 1,
    'method': 1,
    'field': 1,
    'static': 1,
    'var': 1,
    'int': 1,
    'char': 1,
    'boolean': 1,
    'void': 1,
    'true': 1,
    'false': 1,
    'null': 1,
    'this': 1,
    'let': 1,
    'do': 1,
    'if': 1,
    'else': 1,
    'while': 1,
    'return': 1,
}

class Tokenizer {
    constructor(inputs) {
        this.inputs = inputs;
        this.tokens = [];
        this.curToken = null;
        this.parser();
    }

    output() {
        let out = ["<tokens>"];
        let tokens = this.tokens.map(t => {
            return t.outPut();
        })
        out = out.concat(tokens);
        out.push("</tokens>");
        return out.join('\n') + '\n';
    }

    parser() {
        this.inputs = this.inputs.replace(/\/\*.*\*\//ig, '')
        this.inputs = this.inputs.replace(/\/\*\*[\S|\s]*\*\//ig, '')
        this.inputs = this.inputs.replace(/\/\/.*/ig, '')
        this.inputs = this.inputs.replace('\t', '').replace('\r', '');
        this.inputs = this.inputs.split('\n');
        this.inputs = this.inputs.map(c => c.trim());
        this.inputs = this.inputs.filter(c => !!c);
        while(this.inputs.length) {
            let line = this.inputs.shift();
            let len = line.length;
            let i = 0;
            while(i < len) {
                if (line[i] === ' ') {
                    i++;
                    continue;
                }
                if (this._isSymbol(line[i])) {
                    this.tokens.push(new Token(SYMBOL, this._enCodeMap(line[i]) ? enCodeMap[line[i]] : line[i]));
                    i++;
                    continue;
                }
                if (this._isIntegerConstant(line[i])) {
                    let val = '';
                    while(i < len && line[i] !== ' ' && !this._isSymbol(line[i])) {
                        val += line[i++];
                    }
                    this.tokens.push(new Token(INTCONTANT, val));
                    continue;
                }
                if (this._isStringConstant(line[i])) {
                    let val = '';
                    i++;
                    while(i < len && line[i] !== '"') {
                        val += line[i++];
                    }
                    i++;
                    this.tokens.push(new Token(STRINGCONTANT, val));
                    continue;
                }
                let val = '';
                while(i < len && line[i] !== ' ' && !this._isSymbol(line[i])) {
                    val += line[i++];
                }
                if (this._isKeyword(val)) {
                    this.tokens.push(new Token(KEYWORKD, val));
                } else {
                    this.tokens.push(new Token(IDENTIFIER, val));
                }
                continue;
            }
        }
    }

    _isSymbol(c) {
        return symbolMap[c] !== undefined;
    }

    _isIntegerConstant(c) {
        return integerMap[c] !== undefined;
    }

    _isStringConstant(c) {
        return c === '"';
    }

    _isKeyword(word) {
        return keywordMap[word] !== undefined;
    }

    _enCodeMap(c) {
        return enCodeMap[c] !== undefined;
    }

    hasMoreTokens() {
        return this.tokens.length > 0;
    }

    advance() {
        if (this.hasMoreTokens()) {
            this.curToken = this.tokens.shift();
            return;
        }
        this.curToken = null;
    }

    tokenType() {
        return this.curToken.tokenType();
    }

    keyword() {
        return this.curToken.getValue();
    }

    symbol() {
        return this.curToken.getValue();
    }

    identifier() {
        return this.curToken.getValue();
    }

    intVal() {
        return this.curToken.getValue();
    }

    stringVal() {
        return this.curToken.getValue();
    }

    outputToken() {
        return this.curToken.outPut();
    }
}

class Token {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }

    tokenType() {
        return this.type;
    }

    getValue() {
        return this.value;
    }

    outPut() {
        return `<${this.type}> ${this.value} </${this.type}>`;
    }
}

module.exports = {
    Tokenizer
}