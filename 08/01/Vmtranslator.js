const fs = require('fs');
const parser = require('./parser');

let asmOut = '';
let asmFileName = '';
let fileName = process.argv[2];

if (fs.lstatSync(fileName).isDirectory()) {
    asmFileName = fileName;
    fs.readdir(fileName, (err, files) => {
        files.forEach(file => {
            let tempArry = file.split('.')
            if (tempArry.pop() == 'vm') {
                let preName = tempArry.join('.')
                let data = fs.readFileSync(`${fileName}/${file}`, 'utf-8')
                data = data.split('\r\n');
                asmOut += parser(data, preName);
            }
        })
        setFileName();
    })
} else {
    let tempArry = fileName.split('.')
    tempArry.pop() 
    let preName = tempArry.join('.')
    asmFileName = preName

    fs.readFile(fileName, 'utf-8', (err, data) => {
        if (err) {
            throw err;
        }
        data = data.split('\r\n');
        asmOut = parser(data, preName);
        setFileName();
    })
}

function setFileName() {
    fs.writeFile(asmFileName + '.asm', asmOut, (err) => {
        if (err) {
            throw err
        }
    })
}