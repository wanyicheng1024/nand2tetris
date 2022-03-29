const code = require('./code')
const {writeComp, writeJump, writeDest} = code
const table = require('./SymbolTable')
let { addEntry, contains, GetAddress, ramAddress, romAddress } = table

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
                if (!firstlyScan) {
                    let aCommandValue = symbol(curCommand, cType);
                    try {
                        aCommandValue = Number.parseInt(aCommandValue);
                    } catch {
                        if (!contains(aCommandValue)) {
                            addEntry(aCommandValue, ramAddress);
                            aCommandValue = ramAddress++;
                        } else {
                            aCommandValue = GetAddress(aCommandValue);
                        }
                    }
                    aCommandValue = number2binary(aCommandValue);
                    binaryOut += aCommandValue + '\r\n';
                } else {
                    romAddress++;
                }
                break;
            case C_COMMAND:
                if (!firstlyScan) {
                    let destOut = writeDest(dest(curCommand, cType));
                    let compOut = writeComp(comp(curCommand, cType));
                    let jumpOut = writeJump(jump(curCommand, cType));
                    binaryOut += '111' + compOut + destOut + jumpOut + '\r\n';
                } else {
                    romAddress++;
                }
                break;
            case L_COMMAND:
                if (firstlyScan) {
                    let label = symbol(curCommand, cType);
                    addEntry(label, romAddress+1);
                }
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
