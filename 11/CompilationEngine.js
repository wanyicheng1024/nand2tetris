const opMap = {
    '+': 1,
    '-': 1,
    '*': 1,
    '/': 1,
    '&': 1,
    '&amp;': 1,
    '|': 1,
    '<': 1,
    '&lt;': 1,
    '>': 1,
    '&gt;': 1,
    '=': 1,
}

const unaryOpMap = {
    '-': 1,
    '~': 1,
}

class Node {
    constructor(nodeType, nodeValue, isSuperNode = false) {
        this.type = nodeType;
        this.value = nodeValue;
        this.isSuperNode = isSuperNode;
        this.childrens = [];
    }
}

class CompilationEngine {
    constructor(tokenizer) {
        this.out = '';
        this.tokenizer = tokenizer;
        this.tokenizer.advance();
        this.root = this.complieClass(0);
    }

    getTree() {
        return this.root;
    }

    complieClass() {

        let node = new Node('class', null, true);

        // class className {
        node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
        this.tokenizer.advance();
        node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
        this.tokenizer.advance();
        node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
        this.tokenizer.advance();

        // 'classVarDec*'
        while(this.tokenizer.keyword() === 'static' || this.tokenizer.keyword() === 'field') {
            let child = this.complieClassVarDec();
            child && node.childrens.push(child);
        }
        // 'subroutineName*'
        while(this.tokenizer.symbol() !== '}') {
            let child = this.complieSubroutine();
            child && node.childrens.push(child);
        }

        // }
        node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));

        return node;
    }

    complieClassVarDec() {
        
        if (this.tokenizer.keyword() === 'static' || this.tokenizer.keyword() === 'field') {
    
            let node = new Node('classVarDec', null, true);

            while(this.tokenizer.symbol() !== ';') {
                node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
                this.tokenizer.advance();
            }
            // ;
            node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
            this.tokenizer.advance();

            return node;
        }
        return null;
    }

    complieSubroutine() {
        if (this.tokenizer.keyword() === 'constructor' || this.tokenizer.keyword() === 'function' || this.tokenizer.keyword() === 'method') {

            let node = new Node('subroutineDec', null, true);

            while(this.tokenizer.symbol() !== '(') {
                node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
                this.tokenizer.advance();
            }

            node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
            this.tokenizer.advance();

            node.childrens.push(this.complieParamerList());

            node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
            this.tokenizer.advance();

            node.childrens.push(this.complieSubroutineBody());

            return node;
        }

        return null;
    }

    complieParamerList() {

        let node = new Node('parameterList', null, true);
        while(this.tokenizer.symbol() !== ')') {
            node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
            this.tokenizer.advance();
        }
        return node;
    }

    complieSubroutineBody() {
       
        let node = new Node('subroutineBody', null, true);

        node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
        this.tokenizer.advance()

        while(this.tokenizer.keyword() === 'var') {
            node.childrens.push(this.complieVarDec());
        }

        node.childrens.push(this.complieStatements());

        node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
        this.tokenizer.advance()

        return node;
    }

    complieVarDec() {

        let node = new Node('varDec', null, true);

        while(this.tokenizer.symbol() !== ';') {
            node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
            this.tokenizer.advance();
        }

        node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
        this.tokenizer.advance()

        return node;
    }

    complieStatements() {
        
        let node = new Node('statements', null, true);
        let stateType = this.tokenizer.keyword();
        while(stateType === 'let' || stateType === 'if' || stateType === 'while' || stateType === 'do' || stateType === 'return') {
            if (stateType === 'let') {
                node.childrens.push(this.complieLet());
                stateType = this.tokenizer.keyword();
                continue;
            }
            if (stateType === 'if') {
                node.childrens.push(this.complieIf());
                stateType = this.tokenizer.keyword();
                continue;
            }
            if (stateType === 'while') {
                node.childrens.push(this.complieWhile());
                stateType = this.tokenizer.keyword();
                continue;
            }
            if (stateType === 'do') {
                node.childrens.push(this.complieDo());
                stateType = this.tokenizer.keyword();
                continue;
            }
            if (stateType === 'return') {
                node.childrens.push(this.complieReturn());
                stateType = this.tokenizer.keyword();
                continue;
            }
            break;
        }
        return node;
    }

    complieDo() {

        let node = new Node('doStatement', null, true);
        // do
        node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
        this.tokenizer.advance();

        // name
        node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
        this.tokenizer.advance();

        if (this.tokenizer.symbol() === '.') {
            // .
            node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
            this.tokenizer.advance();

            // name
            node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
            this.tokenizer.advance();

            // (
            node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
            this.tokenizer.advance();

            // expressionList
            node.childrens.push(this.complieExpressionList());
            
            // )
            node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
            this.tokenizer.advance();
        } else {
            // (
            node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
            this.tokenizer.advance();

            // expressionList
            node.childrens.push(this.complieExpressionList());
            
            // )
            node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
            this.tokenizer.advance();
        }

        // ;
        node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
        this.tokenizer.advance();
        return node;
    }

    complieLet() {
        let node = new Node('letStatement', null, true);
        
         // let
        node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
        this.tokenizer.advance();

        // varName
        node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
        this.tokenizer.advance();

        if (this.tokenizer.symbol() === '[') {
            // [
            node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
            this.tokenizer.advance();
            // expression
            node.childrens.push(this.complieExpression());
            // ]
            node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
            this.tokenizer.advance();
        }

        // =
        node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
        this.tokenizer.advance();

        // expression
        node.childrens.push(this.complieExpression());
        
        // ;
        node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
        this.tokenizer.advance();


        return node;
    }

    complieWhile() {
        let node = new Node('whileStatement', null, true);


         // if
        node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
        this.tokenizer.advance();

        // (
        node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
        this.tokenizer.advance();

        // expression
        node.childrens.push(this.complieExpression());

        // )
        node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
        this.tokenizer.advance();

        // {
        node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
        this.tokenizer.advance();

        // statements
        node.childrens.push(this.complieStatements());

        // }
        node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
        this.tokenizer.advance();

        return node;
    }

    complieReturn() {
        let node = new Node('returnStatement', null, true);


         // return
        node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
        this.tokenizer.advance();

        if (this.tokenizer.keyword() !== ';') {

            // expression
            node.childrens.push(this.complieExpression());

        }

        // ;
        node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
        this.tokenizer.advance();

        return node;
    }

    complieIf() {
        let node = new Node('ifStatement', null, true);

         // if
        node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
        this.tokenizer.advance();

        // (
        node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
        this.tokenizer.advance();

        // expression
        node.childrens.push(this.complieExpression());

        // )
        node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
        this.tokenizer.advance();

        // {
        node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
        this.tokenizer.advance();

        // statements
        node.childrens.push(this.complieStatements());

        // }
        node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
        this.tokenizer.advance();

        if (this.tokenizer.keyword() === 'else') {
            // else
            node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
            this.tokenizer.advance();

            // {
            node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
            this.tokenizer.advance();

            // statements
            node.childrens.push(this.complieStatements());

            // }
            node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
            this.tokenizer.advance();
        }

        return node;
    }

    complieExpression() {

        let node = new Node('expression', null, true);


        node.childrens.push(this.complieTerm());

        while (this._isOp(this.tokenizer.keyword())) {

            // op
            node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
            this.tokenizer.advance();

            node.childrens.push(this.complieTerm());
        }

        return node;
    }

    complieTerm() {

        let node = new Node('term', null, true);


        if (this._isUnaryOp(this.tokenizer.keyword())) {
            node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
            this.tokenizer.advance();

            node.childrens.push(this.complieTerm());
        } else if (this.tokenizer.keyword() === '('){
            // (
            node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
            this.tokenizer.advance();

            node.childrens.push(this.complieExpression())

            // )
            node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
            this.tokenizer.advance();
        } else {
            node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
            this.tokenizer.advance();

            if (this.tokenizer.keyword() === '[') {
                // [
                node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
                this.tokenizer.advance();

                node.childrens.push(this.complieExpression())

                node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
                this.tokenizer.advance();
            } else {
                if (this.tokenizer.symbol() !== ';') {
                    if (this.tokenizer.symbol() === '.' || this.tokenizer.symbol() === '[' || this.tokenizer.symbol() === '(') {
                        if (this.tokenizer.symbol() === '.' || this.tokenizer.symbol() === '[') {
                            // .
                            node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
                            this.tokenizer.advance();
                
                            // name
                            node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
                            this.tokenizer.advance();
                        }
                
                        // (
                        node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
                        this.tokenizer.advance();
                
                        // expressionList
                        node.childrens.push(this.complieExpressionList());

                        // )
                        node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
                        this.tokenizer.advance();
                    }
                    
                }
            }
        }

        return node;
    }

    complieExpressionList() {
        let node = new Node('expressionList', null, true);

        if (this.tokenizer.symbol() !== ')') {

            // expression
            node.childrens.push(this.complieExpression());

            while (this.tokenizer.symbol() === ',') {
                // ,
                node.childrens.push(new Node(this.tokenizer.tokenType(), this.tokenizer.getValue()));
                this.tokenizer.advance();
                // expression
                node.childrens.push(this.complieExpression());
            }
        }

        return node;
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