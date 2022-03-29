const baseCode = '000';
const jumpMap = {
    'JGT': '001',
    'JEQ': '010',
    'JGE': '011',
    'JLT': '100',
    'JNE': '101',
    'JLE': '110',
    'JMP': '111',
}
const compMap = {
    '0': '101010',
    '1': '111111',
    '-1': '111010',
    'D': '001100',
    'A': '110000',
    '!D': '001101',
    '!A': '110001',
    '-D': '001111',
    '-A': '110011',
    'D+1': '011111',
    'A+1': '110111',
    'D-1': '001110',
    'A-1': '110010',
    'D+A': '000010',
    'D-A': '010011',
    'A-D': '000111',
    'D&A': '000000',
    'D|A': '010101'
}

function writeDest(dest) {
    if (!dest) return baseCode;
    dest = dest.trim();
    let dests = baseCode.split('');
    if (dest.indexOf('A') > -1) {
        dests[0] = '1';
    }
    if (dest.indexOf('D') > -1) {
        dests[1] = '1';
    }
    if (dest.indexOf('M') > -1) {
        dests[2] = '1';
    }
    return dests.join('');
}
function writeComp(comp) {
    // remove the spaces
    comp = comp.trim().split('').filter(e => !!e).join('');
    let pre = '0';
    if (comp.indexOf('M') > -1) {
        pre = '1';
        comp = comp.replace('M', 'A');
    }
    let out = compMap[comp];
    if (!out) {
        if (comp.indexOf('+') > -1 || comp.indexOf('&') > -1 || comp.indexOf('|') > -1) {
            // reverse the input D + A = A + D
            comp = comp.split('').reverse().join('');
            out = compMap[comp];
        }
    }
    return pre + out;
}
function writeJump(jump) {
    if (!jump) {
        return baseCode;
    }
    jump = jump.trim();
    return jumpMap[jump];
}

module.exports = {
    writeDest,
    writeComp,
    writeJump
}
