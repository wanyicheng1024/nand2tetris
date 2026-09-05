const fs = require('fs');
const parser = require('./Parser');

let fileName = process.argv[2];

fs.readFile(fileName, 'utf-8', (err, data) => {
    if (err) {
        throw err;
    }

    data = data.split('\n');

    // parser([...data], true);

    let binaryOut = parser(data);
    // 剔除最后一个换行符
    binaryOut = binaryOut.split('\r\n').filter(c => !!(c.trim())).join('\r\n');

    fileName = fileName.split('.')[0];

    fs.writeFile(fileName + '.hack', binaryOut, (err) => {
        if (err) {
            throw err;
        }
    })
})
