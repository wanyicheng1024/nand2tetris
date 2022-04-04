const opMap = {
    '+': 1,
    '-': 1,
    '*': 1,
    '/': 1,
    '&': 1,
    '|': 1,
    '<': 1,
    '>': 1,
    '=': 1,
}

const unaryOpMap = {
    '-': 1,
    '~': 1,
}

class CompilationEngine {
    constructor(tokenizer) {
        this.out = '';
        this.tokenizer = tokenizer;
        this.tokenizer.advance();
        this.complieClass(0);
    }

    complieClass(preSpace) {
        let nextPace = preSpace + 2;
        this.out += ' '.repeat(preSpace) + '<class>' + '\n';
        // 'class'
        this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
        this.tokenizer.advance();
        // className
        this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
        this.tokenizer.advance();
        // {
        this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
        this.tokenizer.advance();
        // 'classVarDec*'
        while(this.tokenizer.keyword() === 'static' || this.tokenizer.keyword() === 'field') {
            this.complieClassVarDec(nextPace);
        }
        // 'subroutineName*'
        while(this.tokenizer.symbol() !== '}') {
            this.complieSubroutine(nextPace);
        }
        // }
        this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
        this.out += ' '.repeat(preSpace) + '</class>' + '\n';
    }

    complieClassVarDec(preSpace) {
        if (this.tokenizer.keyword() === 'static' || this.tokenizer.keyword() === 'field') {
            let nextPace = preSpace + 2;
            this.out += ' '.repeat(preSpace) + '<classVarDec>' + '\n';
            while(this.tokenizer.symbol() !== ';') {
                this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
                this.tokenizer.advance();
            }
            // ;
            this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
            this.tokenizer.advance();

            this.out += ' '.repeat(preSpace) + '</classVarDec>' + '\n';
        }
    }

    complieSubroutine(preSpace) {
        if (this.tokenizer.keyword() === 'constructor' || this.tokenizer.keyword() === 'function' || this.tokenizer.keyword() === 'method') {
            let nextPace = preSpace + 2;
            this.out += ' '.repeat(preSpace) + '<subroutineDec>' + '\n';
            while(this.tokenizer.symbol() !== '(') {
                this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
                this.tokenizer.advance();
            }
            // (
            this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
            this.tokenizer.advance();

            // parameterList
            this.complieParamerList(nextPace);
            // )
            this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
            this.tokenizer.advance();

            // subroutineBody
            this.complieSubroutineBody(nextPace);
            
            this.out += ' '.repeat(preSpace) + '</subroutineDec>' + '\n';
        }
    }

    complieParamerList(preSpace) {
        let nextPace = preSpace + 2;
        this.out += ' '.repeat(preSpace) + '<parameterList>' + '\n';
        while(this.tokenizer.symbol() !== ')') {
            this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
            this.tokenizer.advance();
        }
        this.out += ' '.repeat(preSpace) + '</parameterList>' + '\n';
    }

    complieSubroutineBody(preSpace) {
        let nextPace = preSpace + 2;
        this.out += ' '.repeat(preSpace) + '<subroutineBody>' + '\n';

         // {
        this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
        this.tokenizer.advance();

        // varDec*
        while(this.tokenizer.keyword() === 'var') {
            this.complieVarDec(nextPace);
        }

        this.complieStatements(nextPace);
        
        // }
        this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
        this.tokenizer.advance();

        this.out += ' '.repeat(preSpace) + '</subroutineBody>' + '\n';
       
    }

    complieVarDec(preSpace) {
        let nextPace = preSpace + 2;
        this.out += ' '.repeat(preSpace) + '<varDec>' + '\n';
        while(this.tokenizer.symbol() !== ';') {
            this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
            this.tokenizer.advance();
        }
        // ;
        this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
        this.tokenizer.advance();

        this.out += ' '.repeat(preSpace) + '</varDec>' + '\n';
    }

    complieStatements(preSpace) {
        let nextPace = preSpace + 2;
        this.out += ' '.repeat(preSpace) + '<statements>' + '\n';
        let stateType = this.tokenizer.keyword();
        while(stateType === 'let' || stateType === 'if' || stateType === 'while' || stateType === 'do' || stateType === 'return') {
            if (stateType === 'let') {
                this.complieLet(nextPace);
                stateType = this.tokenizer.keyword();
                continue;
            }
            if (stateType === 'if') {
                this.complieIf(nextPace);
                stateType = this.tokenizer.keyword();
                continue;
            }
            if (stateType === 'while') {
                this.complieWhile(nextPace);
                stateType = this.tokenizer.keyword();
                continue;
            }
            if (stateType === 'do') {
                this.complieDo(nextPace);
                stateType = this.tokenizer.keyword();
                continue;
            }
            if (stateType === 'return') {
                this.complieReturn(nextPace);
                stateType = this.tokenizer.keyword();
                continue;
            }
            break;
        }
        this.out += ' '.repeat(preSpace) + '</statements>' + '\n';
    }

    complieDo(preSpace) {
        let nextPace = preSpace + 2;
        this.out += ' '.repeat(preSpace) + '<doStatement>' + '\n';

        // do
        this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
        this.tokenizer.advance();

        // name
        this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
        this.tokenizer.advance();

        if (this.tokenizer.symbol() === '.') {
            // .
            this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
            this.tokenizer.advance();

            // name
            this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
            this.tokenizer.advance();

            // (
            this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
            this.tokenizer.advance();

            // expressionList
            this.complieExpressionList(nextPace);
            
            // )
            this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
            this.tokenizer.advance();
        } else {
            // (
            this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
            this.tokenizer.advance();

            // expressionList
            this.complieExpressionList(nextPace);
            
            // )
            this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
            this.tokenizer.advance();
        }

        // ;
        this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
        this.tokenizer.advance();

        this.out += ' '.repeat(preSpace) + '</doStatement>' + '\n';
    }

    complieLet(preSpace) {
        let nextPace = preSpace + 2;
        this.out += ' '.repeat(preSpace) + '<letStatement>' + '\n';

         // let
        this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
        this.tokenizer.advance();

        // varName
        this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
        this.tokenizer.advance();

        if (this.tokenizer.symbol() === '[') {
            // [
            this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
            this.tokenizer.advance();
            // expression
            this.complieExpression(nextPace);
            // ]
            this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
            this.tokenizer.advance();
        }

        // =
        this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
        this.tokenizer.advance();

        // expression
        this.complieExpression(nextPace);
        
        // ;
        this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
        this.tokenizer.advance();

        this.out += ' '.repeat(preSpace) + '</letStatement>' + '\n';
    }

    complieWhile(preSpace) {
        let nextPace = preSpace + 2;
        this.out += ' '.repeat(preSpace) + '<whileStatement>' + '\n';

         // if
        this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
        this.tokenizer.advance();

        // (
        this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
        this.tokenizer.advance();

        // expression
        this.complieExpression(nextPace);

        // )
        this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
        this.tokenizer.advance();

        // {
        this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
        this.tokenizer.advance();

        // statements
        this.complieStatements(nextPace);

        // }
        this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
        this.tokenizer.advance();

        this.out += ' '.repeat(preSpace) + '</whileStatement>' + '\n';
    }

    complieReturn(preSpace) {
        let nextPace = preSpace + 2;
        this.out += ' '.repeat(preSpace) + '<returnStatement>' + '\n';

         // return
        this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
        this.tokenizer.advance();

        if (this.tokenizer.keyword() !== ';') {

            // expression
            this.complieExpression(nextPace);

        }

        // ;
        this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
        this.tokenizer.advance();

        this.out += ' '.repeat(preSpace) + '</returnStatement>' + '\n';
    }

    complieIf(preSpace) {
        let nextPace = preSpace + 2;
        this.out += ' '.repeat(preSpace) + '<ifStatement>' + '\n';

         // if
        this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
        this.tokenizer.advance();

        // (
        this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
        this.tokenizer.advance();

        // expression
        this.complieExpression(nextPace);

        // )
        this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
        this.tokenizer.advance();

        // {
        this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
        this.tokenizer.advance();

        // statements
        this.complieStatements(nextPace);

        // }
        this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
        this.tokenizer.advance();

        if (this.tokenizer.keyword() === 'else') {
            // else
            this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
            this.tokenizer.advance();

            // {
            this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
            this.tokenizer.advance();

            // statements
            this.complieStatements(nextPace);

            // }
            this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
            this.tokenizer.advance();
        }

        this.out += ' '.repeat(preSpace) + '</ifStatement>' + '\n';
    }

    complieExpression(preSpace) {
        let nextPace = preSpace + 2;
        this.out += ' '.repeat(preSpace) + '<expression>' + '\n';

        this.complieTerm(nextPace);

        while (this._isOp(this.tokenizer.keyword())) {

            // op
            this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
            this.tokenizer.advance();

            this.complieTerm(nextPace);
        }

        this.out += ' '.repeat(preSpace) + '</expression>' + '\n';
    }

    complieTerm(preSpace) {
        let nextPace = preSpace + 2;
        this.out += ' '.repeat(preSpace) + '<term>' + '\n';

        if (this._isUnaryOp(this.tokenizer.keyword())) {
            this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
            this.tokenizer.advance();

            this.complieTerm(nextPace);
        } else if (this.tokenizer.keyword() === '('){
            // (
            this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
            this.tokenizer.advance();

            this.complieExpression(nextPace)

            // )
            this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
            this.tokenizer.advance();
        } else {
            this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
            this.tokenizer.advance();

            if (this.tokenizer.keyword() === '[') {
                // [
                this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
                this.tokenizer.advance();

                this.complieExpression(nextPace)

                this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
                this.tokenizer.advance();
            } else {
                if (this.tokenizer.symbol() !== ';') {
                    if (this.tokenizer.symbol() === '.' || this.tokenizer.symbol() === '[' || this.tokenizer.symbol() === '(') {
                        if (this.tokenizer.symbol() === '.' || this.tokenizer.symbol() === '[') {
                            // .
                            this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
                            this.tokenizer.advance();
                
                            // name
                            this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
                            this.tokenizer.advance();
                        }
                
                        // (
                        this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
                        this.tokenizer.advance();
                
                        // expressionList
                        this.complieExpressionList(nextPace);
                    }
                    
                }
            }
        }

        this.out += ' '.repeat(preSpace) + '</term>' + '\n';
    }

    complieExpressionList(preSpace) {
        let nextPace = preSpace + 2;
        this.out += ' '.repeat(preSpace) + '<expressionList>' + '\n';

        if (this.tokenizer.symbol() !== ')') {

            // expression
            this.complieExpression(nextPace);

            while (this.tokenizer.symbol() === ',') {
                // ,
                this.out += ' '.repeat(nextPace) + this.tokenizer.outputToken() + '\n';
                this.tokenizer.advance();
                // expression
                this.complieExpression(nextPace);
            }
        }

        this.out += ' '.repeat(preSpace) + '</expressionList>' + '\n';
    }

    _isOp(symbol) {
        return opMap[symbol] !== undefined;
    }

    _isUnaryOp(symbol) {
        return unaryOpMap[symbol] !== undefined;
    }

    output() {
        return this.out;
    }
}

module.exports = {
    CompilationEngine
}