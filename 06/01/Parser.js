const code = require('./code')
const {writeComp, writeJump, writeDest} = code

const A_COMMAND = 'A';
const C_COMMAND = 'C';
const L_COMMAND = 'L';
const aCommandRegex = /^@(.+)/i;
const cCommandRegex = /^(((.+)=.+)|(.{1};.+))/i;
const lCommandRegex = /^\((.+)\)/i;
const commentRegex = /\/\/.*/i;

function parser(commands, firstlyScan = false) {
    // remove the spaces and comments
    commands = commands.map(c => c.trim());
    commands = commands.filter(c => !!c);
    commands = commands.filter(c => !commentRegex.test(c));
    let curCommand = '';
    let binaryOut = '';
    while(curCommand = advance(commands)) {
        let cType = commandType(curCommand);
        switch(cType) {
            case A_COMMAND:
                let aCommandValue = symbol(curCommand, cType);
                aCommandValue = number2binary(aCommandValue);
                binaryOut += aCommandValue + '\r\n';
                break;
            case C_COMMAND:
                let destOut = writeDest(dest(curCommand, cType));
                let compOut = writeComp(comp(curCommand, cType));
                let jumpOut = writeJump(jump(curCommand, cType));
                binaryOut += '111' + compOut + destOut + jumpOut + '\r\n';
                break;
            case L_COMMAND:
                break;
            default:
                continue;
        }
    }
    return binaryOut;
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
    if (aCommandRegex.test(command)) {
        return A_COMMAND;
    } else if (cCommandRegex.test(command)) {
        return C_COMMAND;
    } else if (lCommandRegex.test(command)) {
        return L_COMMAND;
    }
    return type;
}

function symbol(command, commandType) {
    if (commandType === A_COMMAND) {
        return aCommandRegex.exec(command)[1];
    } else {
        return lCommandRegex.exec(command)[1];
    }
}

function dest(command, commandType) {
    if (commandType === C_COMMAND) {
        if (command.indexOf('=') > -1) {
            return command.split('=')[0];
        } else {
            return null;
        }
    }
}

function comp(command, commandType) {
    if (commandType === C_COMMAND) {
        if (command.indexOf('=') > -1) {
            return command.split('=')[1];
        } else if (command.indexOf(';') > -1) {
            return command.split(';')[0];
        } else{
            return null;
        }
    }
}

function jump(command, commandType) {
    if (commandType === C_COMMAND) {
        if (command.indexOf(';') > -1) {
            return command.split(';')[1];
        } else {
            return null;
        }
    }
}

function number2binary(num) {
    let binary = Number.parseInt(num).toString(2);
    while(binary.length < 16) {
        binary = '0' + binary;
    }
    return binary;
}

module.exports = parser
