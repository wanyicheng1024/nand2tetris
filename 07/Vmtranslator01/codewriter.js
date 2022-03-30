let labelIndex = 0;

function writeArithmetic(command) {
    let out = '';
    switch(command) {
        case 'add':
            out = writeAdd();
            break;
        case 'sub':
            out = writeSub();
            break;
        case 'neg':
            out = writeNeg();
            break;
        case 'eq':
            out = writeEq();
            break; 
        case 'gt':
            out = writeGt();
            break;
        case 'lt':
            out = writeLt();
            break; 
        case 'and':
            out = writeAnd();
            break;
        case 'or':
            out = writeOr();
            break;
        case 'not':
            out = writeNot();
            break;    
    }
    return out;
}

function writePushPop(command, commandType, arg1, arg2) {
    let out = '';
    switch(arg1) {
        case 'constant':
            out = writeConstant(arg2);
            break;
    }
    return out;
}

function writeAdd() {
    let out = '' + 
        '@SP \r\n' +
        'M = M - 1 \r\n' +
        'A = M \r\n' +
        'D = M \r\n' +
        '@SP \r\n' +
        'M = M - 1 \r\n' +
        'A = M \r\n' +
        'D = D + M \r\n' +
        'M = D \r\n' +
        '@SP \r\n' +
        'M = M + 1 \r\n'
    ;
    return out;
}

function writeSub() {
    let out = '' +
        '@SP \r\n' +
        'M = M - 1 \r\n' +
        'A = M \r\n' +
        'D = M \r\n' +
        '@SP \r\n' +
        'M = M - 1 \r\n' +
        'A = M \r\n' +
        'D = M - D \r\n' +
        'M = D \r\n' +
        '@SP \r\n' +
        'M = M + 1 \r\n'
    ;
    return out;
}

function writeNeg() {
    let out = '' +
        '@SP \r\n' +
        'M = M - 1 \r\n' +
        'A = M \r\n' +
        'M = -M \r\n' +
        '@SP \r\n' +
        'M = M + 1 \r\n'
    ;
    return out;
}

function writeEq() {
    let out = '' +
        '@SP \r\n' +
        'M = M - 1 \r\n' +
        'A = M \r\n' +
        'D = M \r\n' +
        '@SP \r\n' +
        'M = M - 1 \r\n' +
        'A = M \r\n' +
        'D = M - D \r\n' +
        '@eq' + labelIndex + '\r\n' +
        'D;JEQ \r\n' +
        '@neq' + labelIndex + '\r\n' +
        '0;JMP \r\n' +
    '(eq' + labelIndex + ')\r\n' +
        '@SP \r\n' +
        'A = M \r\n' +
        'M = -1 \r\n' +
        '@final' + labelIndex + '\r\n' +
        '0;JMP \r\n' +
    '(neq' + labelIndex + ')\r\n' +
        '@SP \r\n' +
        'A = M \r\n' +
        'M = 0 \r\n' +
        '@final' + labelIndex + '\r\n' +
        '0;JMP \r\n' +
    '(final' + labelIndex + ')\r\n' +
        '@SP \r\n' +
        'M = M + 1 \r\n'
    ;
    labelIndex++;
    return out;
}

function writeGt() {
    let out = '' +
        '@SP \r\n' +
        'M = M - 1 \r\n' +
        'A = M \r\n' +
        'D = M \r\n' +
        '@SP \r\n' +
        'M = M - 1 \r\n' +
        'A = M \r\n' +
        'D = M - D \r\n' +
        '@gt' + labelIndex + '\r\n' +
        'D;JGT \r\n' +
        '@ngt' + labelIndex + '\r\n' +
        '0;JMP \r\n' +
    '(gt' + labelIndex + ')\r\n' +
        '@SP \r\n' +
        'A = M \r\n' +
        'M = -1 \r\n' +
        '@final' + labelIndex + '\r\n' +
        '0;JMP \r\n' +
    '(ngt' + labelIndex + ')\r\n' +
        '@SP \r\n' +
        'A = M \r\n' +
        'M = 0 \r\n' +
        '@final' + labelIndex + '\r\n' +
        '0;JMP \r\n' +
    '(final' + labelIndex + ')\r\n' +
        '@SP \r\n' +
        'M = M + 1 \r\n'
    ;
    labelIndex++;
    return out;
}

function writeLt() {
    let out = '' +
        '@SP \r\n' +
        'M = M - 1 \r\n' +
        'A = M \r\n' +
        'D = M \r\n' +
        '@SP \r\n' +
        'M = M - 1 \r\n' +
        'A = M \r\n' +
        'D = M - D \r\n' +
        '@lt' + labelIndex + '\r\n' +
        'D;JLT \r\n' +
        '@nlt' + labelIndex + '\r\n' +
        '0;JMP \r\n' +
    '(lt' + labelIndex + ')\r\n' +
        '@SP \r\n' +
        'A = M \r\n' +
        'M = -1 \r\n' +
        '@final' + labelIndex + '\r\n' +
        '0;JMP \r\n' +
    '(nlt' + labelIndex + ')\r\n' +
        '@SP \r\n' +
        'A = M \r\n' +
        'M = 0 \r\n' +
        '@final' + labelIndex + '\r\n' +
        '0;JMP \r\n' +
    '(final' + labelIndex + ')\r\n' +
        '@SP \r\n' +
        'M = M + 1 \r\n'
    ;
    labelIndex++;
    return out;
}

function writeAnd() {
    let out = '' +
        '@SP \r\n' +
        'M = M - 1 \r\n' +
        'A = M \r\n' +
        'D = M \r\n' +
        '@SP \r\n' +
        'M = M - 1 \r\n' +
        'A = M \r\n' +
        'D = D & M \r\n' +
        'M = D \r\n' +
        '@SP \r\n' +
        'M = M + 1 \r\n'
    ;
    return out;
}

function writeOr() {
    let out = '' +
        '@SP \r\n' +
        'M = M - 1 \r\n' +
        'A = M \r\n' +
        'D = M \r\n' +
        '@SP \r\n' +
        'M = M - 1 \r\n' +
        'A = M \r\n' +
        'D = D | M \r\n' +
        'M = D \r\n' +
        '@SP \r\n' +
        'M = M + 1 \r\n'
    ;
    return out;
}

function writeNot() {
    let out = '' +
        '@SP \r\n' +
        'M = M - 1 \r\n' +
        'A = M \r\n' +
        'M = !M \r\n' +
        '@SP \r\n' +
        'M = M + 1 \r\n'
    ;
    return out;
}

function writeConstant(arg2) {
    let out = '' +
        '@' + arg2 + '\r\n' +
        'D = A \r\n' +
        '@SP \r\n' +
        'A = M \r\n' +
        'M = D \r\n' +
        '@SP \r\n' +
        'M = M + 1 \r\n'
    ;
    return out;
}

module.exports = {
    writeArithmetic,
    writePushPop
}