const code = require('./codewriter')
const {writeArithmetic, writePushPop} = code

const C_ARITHMETIC = 'C_ARITHMETIC';
const C_PUSH = 'C_PUSH';
const C_POP = 'C_POP';
const C_LABEL = 'C_LABEL';
const C_GOTO = 'C_GOTO';
const C_IF = 'C_IF';
const C_FUNCTION = 'C_FUNCTION';
const C_RETURN = 'C_RETURN';
const C_CALL = 'C_CALL';
const arithmeticCommandRegex = /^(add|sub|neg|eq|gt|lt|and|or|not)/i;
const pushCommandRegex = /^push.*/i;
const popCommandRegex = /^pop.*/i;
const labelCommandRegex = /^label.*/i;
const gotoCommandRegex = /^goto.*/i;
const ifCommandRegex = /^if-goto.*/i;
const functionCommandRegex = /^function.*/i;
const returnCommandRegex = /^return.*/i;
const callCommandRegex = /^call.*/i;
const commentRegex = /\/\/.*/i;

function parser(commands, fileName) {
    // remove the spaces and comments
    commands = commands.map(c => c.trim());
    commands = commands.filter(c => !!c);
    commands = commands.filter(c => !commentRegex.test(c));
    let curCommand = '';
    let output = '';
    while(curCommand = advance(commands)) {
        let cType = commandType(curCommand);
        switch(cType) {
            case C_ARITHMETIC:
                output += writeArithmetic(curCommand);
                break;
            case C_PUSH:
            case C_POP:
                let a1 = arg1(curCommand);
                let a2 = arg2(curCommand);
                output += writePushPop(curCommand, cType, a1, a2);
                break;
            default:
                continue;
        }
    }
    return output;
}

function hasMoreCommands(commands) {
    return commands && commands.length > 0;
}

function advance(commands) {
    if (hasMoreCommands(commands)) {
        return commands.shift();
    }
    return '';
}


function commandType(command) {
    command = command.trim();
    command = command.replace(commentRegex, '');

    let type = 'ignoreTypeCommand';
    if (arithmeticCommandRegex.test(command)) {
        return C_ARITHMETIC;
    } else if (pushCommandRegex.test(command)) {
        return C_PUSH;
    } else if (popCommandRegex.test(command)) {
        return C_POP;
    } else if (labelCommandRegex.test(command)) {
        return C_LABEL;
    } else if (gotoCommandRegex.test(command)) {
        return C_GOTO;
    } else if (ifCommandRegex.test(command)) {
        return C_IF;
    } else if (functionCommandRegex.test(command)) {
        return C_FUNCTION;
    } else if (returnCommandRegex.test(command)) {
        return C_RETURN;
    } else if (callCommandRegex.test(command)) {
        return C_CALL;
    }
    return type;
}

function arg1(command) {
    let temps = command.split(' ').map(e => e.trim()).filter(e => !!e);
    return temps[1];
}

function arg2(command) {
    let temps = command.split(' ').map(e => e.trim()).filter(e => !!e);
    return temps[2];
}

module.exports = parser
