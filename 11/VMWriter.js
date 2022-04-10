
let curScope = null;
let classScope = null;
let curParentNodeType = null;
let curParentNode = null;
let className = '';
let funcName = '';
let out = '';
let whileLabelIndex = 0;
let ifLabelIndex = 0;
let isInMethodFunction = false;

function reset() {
    curScope = null;
    classScope = null;
    curParentNodeType = null;
    curParentNode = null;
    className = '';
    funcName = '';
    out = '';
    whileLabelIndex = 0;
    ifLabelIndex = 0;
    isInMethodFunction = false;
}

function vmWriter(root, first = true) {
    if (first) {
        reset();
    }
    let visit = (node) => {
        let needVisitItsChild = true;
        if (!node.isSuperNode) {
            ;
        } else {
            curParentNode = node;
            curParentNodeType = node.type;
            if (curParentNodeType === 'class') {
                classScope = node.scope;
                curScope = node.scope;
                className = node.childrens[1].value;
            }
            else if (curParentNodeType === 'subroutineDec') {
                curScope = node.scope;
                funcName = node.childrens[2].value;
                whileLabelIndex = 0;
                ifLabelIndex = 0;
                if (node.childrens[0].value === 'method') {
                    isInMethodFunction = true;
                } else {
                    isInMethodFunction = false;
                }
                writeFunction(node);
            } 
            else if (curParentNodeType === 'doStatement') {
                writeCall(node, true);
            }
            else if (curParentNodeType === 'returnStatement') {
                writeReturn(node);
            }
            else if (curParentNodeType === 'letStatement') {
                processLet(node);
                needVisitItsChild = false;
            }
            else if (curParentNodeType === 'whileStatement') {
                processWhile(node);
                needVisitItsChild = false;
            }
            else if (curParentNodeType === 'ifStatement') {
                processIf(node);
                needVisitItsChild = false;
            }
            if (needVisitItsChild && node.childrens.length) {
                for(let i=0;i<node.childrens.length;i++) {
                    visit(node.childrens[i]);
                }
            }
        }
    }
    visit(root);
    
    return out;
}

function writePush(segment, index) {
    out += 'push ' + segment + ' ' + index + '\n';
}

function writePop(segment, index) {
    out += 'pop ' + segment + ' ' + index + '\n';
}

function writeArithmetic(op, index = 0) {
    let str = arithmeticMap[op];
    if (typeof str !== 'string') {
        str = str[index];
    }
    out += str + '\n';
}

function isConstantValue(v) {
    return ['true', 'false', 'null', 'this'].includes(v);
}

function writeConstantValue(v) {
    if (v === 'true') {
        writePush('constant', '0');
        writeArithmetic('~');
    } else if (v === 'false') {
        writePush('constant', '0');
    } else if (v === 'null') {
        writePush('constant', '0');
    } else if (v === 'this') {
        writePush('pointer', '0');
    }
}

function writeLabel(label) {
    out += 'label ' + label + '\n';
}

function writeGoto(label) {
    out += 'goto ' + label + '\n';
}

function writeIf(label) {
    out += 'if-goto ' + label + '\n';
}

function processWhile(n) {
    let index = whileLabelIndex++
    let L1 = 'WHILE_EXP' + index;
    let L2 = 'WHILE_END' + index;
    writeLabel(L1);

    processExpression(n.childrens[2]);
    writeArithmetic('~');
    writeIf(L2);
    vmWriter(n.childrens[5], false);
    writeGoto(L1);

    writeLabel(L2);
}

function processIf(n) {
    let index = ifLabelIndex++;
    let L1 = 'IF_TRUE' + index;
    let L2 = 'IF_FALSE'+ index;
    let L3 = 'IF_END'+ index;
    processExpression(n.childrens[2]);
    writeIf(L1);
    writeGoto(L2);
    writeLabel(L1);
    vmWriter(n.childrens[5], false);
    if (n.childrens.length > 10) {
        writeGoto(L3);
    }
    writeLabel(L2);
    if (n.childrens.length > 10) {
        vmWriter(n.childrens[9], false);
        writeLabel(L3);
    }
}

function processLet(n) {
    if (n.childrens[2].value === '[') {
        processExpression(n.childrens[3]);
        let v = n.childrens[1].value;
        let type = curScope.Kindof(v);
        let index = curScope.IndexOf(v);
        let segment = getSegment(type); 
        writePush(segment, index);
        writeArithmetic('+');
        processExpression(n.childrens[6]);
        writePop('temp', '0');
        writePop('pointer', '1');
        writePush('temp', '0');
        writePop('that', '0');
    } else {
        processExpression(n.childrens[3]);
        let v = n.childrens[1].value;
        let type = curScope.Kindof(v);
        let index = curScope.IndexOf(v);
        let segment = getSegment(type); 
        writePop(segment, index);
    }
}

function getSegment(type) {
    return type === 'STATIC' ? 'static' : type === 'VAR' ? 'local' :  type === 'ARG' ? 'argument' : type === 'FIELD' ? 'this' : ''
}

function getAscii(char) {
    return char.charCodeAt();
}

function processString(str) {
    let len = str.length;
    writePush('constant', len);
    out += 'call String.new 1' + '\n';
    for(let i=0;i<len;++i) {
        writePush('constant', getAscii(str[i])) ;
        out += 'call String.appendChar 2' + '\n';
    }

}

function processExpression(n) {
    if (n.type === 'expression') {
        if  (n.childrens.length == 3) {
            let exp1 = n.childrens[0];
            let exp2 = n.childrens[2];
            let op = n.childrens[1];
            processExpression(exp1);
            processExpression(exp2);
            if (isArithmetic(op.value)) {
                writeArithmetic(op.value, 0);
            } else {
                // * /
                if (op.value === '*') {
                    out += 'call ' + 'Math.multiply 2' + '\n';
                } else {
                    out += 'call ' + 'Math.divide 2' + '\n';
                }
            }
        } else {
            for(let i=0;i<n.childrens.length;++i) {
                processExpression(n.childrens[i]);
            }
        }
    } else if (n.type === 'term') {
        if (n.childrens.length == 2) {
            processExpression(n.childrens[1]);
            writeArithmetic(n.childrens[0].value, 1);
        } else if ((n.childrens.length > 1 && n.childrens[1].value === '(') || (n.childrens.length > 3 && n.childrens[3].value === '(')) {
            writeCall(n, false, true);
        } else if (n.childrens.length > 1 && n.childrens[1].value === '[') {
            processExpression(n.childrens[2]);
            let v = n.childrens[0].value;
            let type = curScope.Kindof(v);
            let index = curScope.IndexOf(v);
            let segment = getSegment(type); 
            writePush(segment, index);
            writeArithmetic('+');
            writePop('pointer', '1');
            writePush('that', '0');
        }
        else {
            for(let i=0;i<n.childrens.length;++i) {
                processExpression(n.childrens[i]);
            }
        }
        
    } else if (isArithmetic(n.value)) {
        writeArithmetic(n.value);
    } else if (isConstantValue(n.value)) {
        writeConstantValue(n.value);
    }
    else if (n.type === 'stringConstant') {
        processString(n.value);
    }
    else if (n.type === 'integerConstant') {
        writePush('constant', n.value);
    } else if (n.type === 'identifier') {
        let type = curScope.Kindof(n.value);
        let index = curScope.IndexOf(n.value);
        let segment = getSegment(type);
        if (isInMethodFunction && type === 'ARG') {
            index += 1;
        }
        writePush(segment, index);
    } else {
        for(let i=0;i<n.childrens.length;++i) {
            processExpression(n.childrens[i]);
        }
    }
}

function writeCall(node, needPop, inTerm) {
    let startIndex = inTerm ? 0 : 1;
    let needThis = true;
    let thisStr = 'pointer';
    let thisIndex = '0';
    let funcName = '';
    if (node.childrens[startIndex+1].value === '.') {
        if (curScope.Kindof(node.childrens[startIndex].value) === null) {
            needThis = false;
            funcName = node.childrens[startIndex].value + '.' + node.childrens[startIndex+2].value;
        } else {
            if (curScope.Kindof(node.childrens[startIndex].value) === 'FIELD') {
                thisStr = 'this';
            }
            if (curScope.Kindof(node.childrens[startIndex].value) === 'VAR') {
                thisStr = 'local';
            }
            thisIndex = curScope.IndexOf(node.childrens[startIndex].value);
            funcName = curScope.TypeOf(node.childrens[startIndex].value)+ '.' + node.childrens[startIndex+2].value;
        }
    } else {
        funcName = className + '.' + node.childrens[startIndex].value;
    }
    let len = node.childrens.length;
    let paramsList = node.childrens[len - (startIndex + 2)].childrens.filter(c => c.value !== ',');
    let argLen = needThis ? paramsList.length + 1 : paramsList.length;
    if (needThis) {
        writePush(thisStr, thisIndex);
    }
    if (paramsList.length) {
        paramsList.forEach(e => {
            processExpression(e);     
        });
    }
    let funStr = 'call ' + funcName + ' ' + argLen + '\n';
    out += funStr;
    if (needPop) {
        writePop('temp', '0');
    }
}

function writeFunction(node) {
    let isConstructor = node.childrens[0].value === 'constructor';
    let isMethod = node.childrens[0].value === 'method';
    let fname = node.childrens[2].value;
    let varLen = curScope.varCount('VAR');
    let name = className + '.' + fname;
    out += 'function ' + name + ' ' + varLen + '\n';
    if (isConstructor) {
        let fieldLen = classScope.varCount('FIELD');
        writePush('constant', fieldLen);
        out += 'call ' + 'Memory.alloc' + ' 1' + '\n';
        writePop('pointer', '0');
    }
    if (isMethod) {
        writePush('argument', '0');
        writePop('pointer', '0');
    }
}

function writeReturn(node) {
    if (node.childrens.length === 2) {
        writePush('constant', '0');
    } else if (node.childrens.length === 3) {
        processExpression(node.childrens[1]);
    }   
    out += 'return' + '\n';
}

arithmeticMap = {
    '+': 'add',
    '-': ['sub', 'neg'],
    '=': 'eq',
    '>': 'gt',
    '&gt;': 'gt',
    '<': 'lt',
    '&lt;': 'lt',
    '&': 'and',
    '&amp;': 'and',
    '|': 'or',
    '~': 'not'
}
function isArithmetic(symbol) {
    return arithmeticMap[symbol] !== undefined;
}

module.exports = {
    vmWriter
}