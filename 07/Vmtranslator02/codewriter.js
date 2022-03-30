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

function writePushPop(command, commandType, arg1, arg2, fileName) {
    let out = '';
    switch(arg1) {
        case 'constant':
            out = writeConstant(arg2);
            break;
        case 'local':
            out = writeLocal(arg2, commandType);
            break;
        case 'argument':
            out = writeArgument(arg2, commandType);
            break;
        case 'this':
            out = writeThis(arg2, commandType);
            break;
        case 'that':
            out = writeThat(arg2, commandType);
            break;
        case 'pointer':
            out = writePointer(arg2, commandType);
            break;
        case 'temp':
            out = writeTemp(arg2, commandType);
            break;
        case 'static':
            out = writeStatic(arg2, commandType, fileName);
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

function writeLocal(arg2, type) {
    let out = '';
    if (type === 'C_PUSH') {
        out += '@' + arg2 + '\r\n' +
            'D = A \r\n' +
            '@R1 \r\n' +
            'A = M \r\n' +
            'A = A + D \r\n' +
            'D = M\r\n' +
            '@SP \r\n' +
            'A = M \r\n' +
            'M = D \r\n' +
            '@SP \r\n' +
            'M = M + 1 \r\n'
        ;
    } else {
        out += 
            '@R1 \r\n' +
            'D = M \r\n' +
            '@' + arg2 + '\r\n' +
            'D = A + D \r\n' +
            '@R13 \r\n' +
            'M = D \r\n' +
            '@SP \r\n' +
            'M = M - 1 \r\n' +
            'A = M \r\n' +
            'D = M \r\n' +
            '@R13 \r\n' +
            'A = M \r\n' +
            'M = D \r\n'
    }
    
    return out;
}

function writeArgument(arg2, type) {
    let out = '';
    if (type === 'C_PUSH') {
        out += '@' + arg2 + '\r\n' +
            'D = A \r\n' +
            '@R2 \r\n' +
            'A = M \r\n' +
            'A = A + D \r\n' +
            'D = M\r\n' +
            '@SP \r\n' +
            'A = M \r\n' +
            'M = D \r\n' +
            '@SP \r\n' +
            'M = M + 1 \r\n'
        ;
    } else {
        out += 
            '@R2 \r\n' +
            'D = M \r\n' +
            '@' + arg2 + '\r\n' +
            'D = A + D \r\n' +
            '@R13 \r\n' +
            'M = D \r\n' +
            '@SP \r\n' +
            'M = M - 1 \r\n' +
            'A = M \r\n' +
            'D = M \r\n' +
            '@R13 \r\n' +
            'A = M \r\n' +
            'M = D \r\n'
    }
    
    return out;
}

function writeThis(arg2, type) {
    let out = '';
    if (type === 'C_PUSH') {
        out += '@' + arg2 + '\r\n' +
            'D = A \r\n' +
            '@R3 \r\n' +
            'A = M \r\n' +
            'A = A + D \r\n' +
            'D = M\r\n' +
            '@SP \r\n' +
            'A = M \r\n' +
            'M = D \r\n' +
            '@SP \r\n' +
            'M = M + 1 \r\n'
        ;
    } else {
        out += 
            '@R3 \r\n' +
            'D = M \r\n' +
            '@' + arg2 + '\r\n' +
            'D = A + D \r\n' +
            '@R13 \r\n' +
            'M = D \r\n' +
            '@SP \r\n' +
            'M = M - 1 \r\n' +
            'A = M \r\n' +
            'D = M \r\n' +
            '@R13 \r\n' +
            'A = M \r\n' +
            'M = D \r\n'
    }
    
    return out;
}

function writeThat(arg2, type) {
    let out = '';
    if (type === 'C_PUSH') {
        out += '@' + arg2 + '\r\n' +
            'D = A \r\n' +
            '@R4 \r\n' +
            'A = M \r\n' +
            'A = A + D \r\n' +
            'D = M\r\n' +
            '@SP \r\n' +
            'A = M \r\n' +
            'M = D \r\n' +
            '@SP \r\n' +
            'M = M + 1 \r\n'
        ;
    } else {
        out += 
            '@R4 \r\n' +
            'D = M \r\n' +
            '@' + arg2 + '\r\n' +
            'D = A + D \r\n' +
            '@R13 \r\n' +
            'M = D \r\n' +
            '@SP \r\n' +
            'M = M - 1 \r\n' +
            'A = M \r\n' +
            'D = M \r\n' +
            '@R13 \r\n' +
            'A = M \r\n' +
            'M = D \r\n'
    }
    
    return out;
}

function writePointer(arg2, type) {
    let v1 = 'R4';
    if (arg2 === '0') {
        v1 = 'R3';
    }
    v2 = '0';
    let out = '';
    if (type === 'C_PUSH') {
        out += '@' + v1 + '\r\n' +
            'D = M\r\n' +
            '@SP \r\n' +
            'A = M \r\n' +
            'M = D \r\n' +
            '@SP \r\n' +
            'M = M + 1 \r\n'
        ;
    } else {
        out += 
            '@SP \r\n' +
            'M = M - 1 \r\n' +
            'A = M \r\n' +
            'D = M \r\n' +
            '@' + v1 + '\r\n' +
            'M = D \r\n'
    }
    
    return out;
}

function writeTemp(arg2, type) {
    let out = '';
    if (type === 'C_PUSH') {
        out += '@' + arg2 + '\r\n' +
            'D = A \r\n' +
            '@R5 \r\n' +
            'A = A + D \r\n' +
            'D = M\r\n' +
            '@SP \r\n' +
            'A = M \r\n' +
            'M = D \r\n' +
            '@SP \r\n' +
            'M = M + 1 \r\n'
        ;
    } else {
        out += 
            '@R5 \r\n' +
            'D = A \r\n' +
            '@' + arg2 + '\r\n' +
            'D = A + D \r\n' +
            '@R13 \r\n' +
            'M = D \r\n' +
            '@SP \r\n' +
            'M = M - 1 \r\n' +
            'A = M \r\n' +
            'D = M \r\n' +
            '@R13 \r\n' +
            'A = M \r\n' +
            'M = D \r\n'
    }
    
    return out;
}

function writeStatic(arg2, type, fileName) {
    let out = '';
    let label = fileName + '.' + arg2;
    if (type === 'C_PUSH') {
        out += 
            '@' + label + '\r\n' +
            'D = M\r\n' +
            '@SP \r\n' +
            'A = M \r\n' +
            'M = D \r\n' +
            '@SP \r\n' +
            'M = M + 1 \r\n'
        ;
    } else {
        out +=
            '@SP \r\n' +
            'M = M - 1 \r\n' +
            'A = M \r\n' +
            'D = M \r\n' +
            '@' + label + '\r\n' +
            'M = D \r\n'
    }
    return out;
}

module.exports = {
    writeArithmetic,
    writePushPop
}