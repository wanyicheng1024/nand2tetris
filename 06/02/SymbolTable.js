const symbolsTable = {};
let ramAddress = 16;
let romAddress = -1;

['SP', 'LCL', 'ARG', 'THIS', 'THAT'].forEach((key, index) => {
    symbolsTable[key] = index;
});
for(let i=0; i<16; ++i) {
    symbolsTable['R'+i] = i;
}
symbolsTable['SCREEN'] = 16384;
symbolsTable['KBD'] = 24576;

function addEntry(symbol, address) {
    symbolsTable[symbol] = address;
}

function contains(symbol) {
    return !!(symbolsTable[symbol] === undefined);
}

function GetAddress(symbol) {
    return symbolsTable[symbol];
}

module.exports = {
    addEntry,
    contains,
    GetAddress,
    ramAddress,
    romAddress
}
