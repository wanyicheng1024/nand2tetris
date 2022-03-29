const fs = require('fs');
const parser = require('./Parser');

let fileName = process.argv[2];

fs.readFile(fileName, 'utf-8', (err, data) => {
    if (err) {
        throw err;
    }

    data = data.split('\r\n');

    parser([...data], true);

    const binaryOut = parser(data);

    fileName = fileName.split('.')[0];

    fs.writeFile(fileName + '.hack', binaryOut, (err) => {
        if (err) {
            throw err;
        }
    })
})
